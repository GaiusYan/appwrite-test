import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";


interface FormAlertProps {
    type: "Success" | "Error" | "Default";
    title: string;
    description: string;
    className?: string;
}



export const FormAlert = ({
    type,
    title,
    description,
    className
} : FormAlertProps) => {
    if (type === "Default") return null;
    return (
        <div >
            <Alert className={className} variant={type == "Success" ? "default" : "destructive"}>
                {type == "Success" ? <CheckCircle2Icon /> : <AlertCircleIcon />}
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>
                    {description}
                </AlertDescription>
            </Alert>
        </div>
    );
};