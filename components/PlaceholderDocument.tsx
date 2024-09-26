'use client'
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { PlusCircleIcon } from "lucide-react";

function PlaceholderDocument() {
    const router = useRouter();

    const handleClick = () => {
        // Check if user is FREE tier and if they are over the file limit ~ push to the upgrade page
        router.push('/dashboard/upload');
    }
    return (
        <Button 
            onClick={handleClick}
            className="flex flex-col items-center justify-center w-64 h-80 rounded-xl bg-gray-200 text-gray-400 drop-shadow-md"
        >
            <PlusCircleIcon className="w-16 h-16" />
            <p className="pt-2">
                Add a document
            </p>
        </Button>
    )
}
export default PlaceholderDocument;