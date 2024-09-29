import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import pineconeClient from './pinecone';
import { PineconeStore } from "@langchain/pinecone";
import { PineconeConflictError } from "@pinecone-database/pinecone/dist/errors";   
import { Index, RecordMetadata } from "@pinecone-database/pinecone";    
import { adminDb } from '@/firebaseAdmin';   
import { auth } from '@clerk/nextjs/server';    
import { GoogleGenerativeAI, ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

// Initialize the Google Generative AI model
const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    modelName: "gemini-pro",
});

export const indexName = 'chatpdf';

export async function generateDocs(docId: string){
    const { userId } = await auth();
    if(!userId){
        throw new Error("User not authenticated");
    }
    console.log("--- Fetching the download URL from Firebase... ---");
    
    const firebaseRef = await adminDb
        .collection('users')
        .doc(userId)
        .collection('files')
        .doc(docId)
        .get();
    const downloadUrl = firebaseRef.data()?.downloadUrl;
    if(!downloadUrl){
        throw new Error("Download URL not found");
    }
    console.log(`--- Download URL fetched successfully: ${downloadUrl} ---`);
    
    try {
        // Fetch the PDF from the specified URL
        const response = await fetch(downloadUrl);
        // Load the PDF into a PDFDocument object
        const data = await response.blob();
        // Load the PDF document from the specified path
        console.log("--- Loading the PDF document... ---");
        const loader = new PDFLoader(data);
        const docs = await loader.load();
        console.log(`--- PDF loaded successfully. Number of pages: ${docs.length} ---`);
        
        // Split the document into smaller chunks for easier processing
        console.log('--- Splitting the document into smaller chunks... ---');
        const splitter = new RecursiveCharacterTextSplitter();
        const splitDocs = await splitter.splitDocuments(docs);
        console.log(`--- Split into ${splitDocs.length} parts ---`);
        
        if (splitDocs.length === 0) {
            console.log("Warning: No content found in the PDF.");
            return null;
        }
        
        return splitDocs;
    } catch (error) {
        console.error("Error in generateDocs:", error);
        throw error;
    }
}

async function namespaceExists(index: Index<RecordMetadata>, namespace: string) {
    if(namespace === null) throw new Error("ATTN: No namespace value provided.");
    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;
}

export async function generateEmbeddingsInPineconeVectorStore(docId: string){
    const { userId } = await auth();
    if(!userId){
        throw new Error("User not authenticated");
    }
    let pineconeVectorStore;
    
    try {
        console.log("--- Generating embeddings... ---");
        const embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY,
            modelName: "embedding-001",
        });
        console.log("Embeddings instance created.");

        // Test embedding generation
        const testEmbedding = await embeddings.embedQuery("This is a test.");
        console.log("Test embedding generated. Length:", testEmbedding.length);

        console.log("Connecting to Pinecone index:", indexName);
        const index = await pineconeClient.index(indexName);
        const stats = await index.describeIndexStats();
        console.log("Pinecone index stats:", stats);

        const namespaceAlreadyExists = await namespaceExists(index, docId);
        if(namespaceAlreadyExists){
            console.log(`--- Namespace ${docId} already exists, reusing existing embeddings... ---`);
            pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
                pineconeIndex: index,
                namespace: docId,
            });
        } else {
            console.log(`--- Namespace ${docId} does not exist. Generating new embeddings... ---`);
            const splitDocs = await generateDocs(docId);
            if (!splitDocs || splitDocs.length === 0) {
                throw new Error("No documents to embed");
            }
            console.log(`--- Storing the embeddings in namespace ${docId} in the ${indexName} Pinecone vector store... ---`);
            pineconeVectorStore = await PineconeStore.fromDocuments(
                splitDocs,
                embeddings,
                {
                    pineconeIndex: index,
                    namespace: docId,
                }
            );
            console.log("--- Embeddings stored successfully ---");
        }

        // Verify vectors were created
        const namespaceStats = await index.describeIndexStats();
        console.log(`Vectors in namespace ${docId}:`, namespaceStats.namespaces?.[docId]?.vectorCount);

        return pineconeVectorStore;
    } catch (error) {
        console.error("Error in generateEmbeddingsInPineconeVectorStore:", error);
        throw error;
    }
}