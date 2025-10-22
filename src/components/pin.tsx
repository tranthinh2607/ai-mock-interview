import { Interview } from "@/types";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Eye, Newspaper, Sparkles, Trash2 } from "lucide-react"; // 1. Import Trash2
import { useState } from "react"; // 2. Import useState
import { deleteDoc, doc } from "firebase/firestore"; // 3. Import firestore functions
import { db } from "@/config/firebase.config"; // 4. Import db config
import { toast } from "sonner"; // 5. Import toast


interface InterviewPinProps {
  interview: Interview;
  onMockPage?: boolean;
}

export const InterviewPin = ({
  interview,
  onMockPage = false,
}: InterviewPinProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false); // 6. Thêm state để quản lý việc xóa

  // 7. Thêm hàm xử lý xóa
  const onDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this interview?")) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, "interviews", interview.id));
      toast.success("Deleted..!", {
        description: "Mock Interview deleted successfully.",
      });
      // Tùy chọn: bạn có thể gọi một hàm callback ở đây để cập nhật UI
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast.error("Error..", {
        description: "Failed to delete the interview. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <Card className="p-4 rounded-md shadow-none hover:shadow-md shadow-gray-100 cursor-pointer transition-all space-y-4">
      <CardTitle className="text-lg">{interview?.position}</CardTitle>
      <CardDescription>{interview?.description}</CardDescription>
      <div className="w-full flex items-center gap-2 flex-wrap">
        {interview?.techStack.split(",").map((word, index) => (
          <Badge
            key={index}
            variant={"outline"}
            className="text-xs text-muted-foreground hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-900"
          >
            {word}
          </Badge>
        ))}
      </div>

      <CardFooter
        className={cn(
          "w-full flex items-center p-0",
          onMockPage ? "justify-end" : "justify-between"
        )}
      >
        <p className="text-[12px] text-muted-foreground truncate whitespace-nowrap">
          {`${new Date(interview?.createdAt.toDate()).toLocaleDateString(
            "en-US",
            { dateStyle: "long" }
          )} - ${new Date(interview?.createdAt.toDate()).toLocaleTimeString(
            "en-US",
            { timeStyle: "short" }
          )}`}
        </p>

        {!onMockPage && (
          <div className="flex items-center justify-center">
            <TooltipButton
              content="View"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/generate/${interview?.id}`, { replace: true });
              }}
              //disbaled={false}
              disbaled={isDeleting} // Sửa lỗi chính tả và vô hiệu hóa khi đang xóa
              buttonClassName="hover:text-sky-500"
              icon={<Eye />}
              loading={false}
            />

            <TooltipButton
              content="Delete"
              buttonVariant={"ghost"}
              onClick={onDelete}
              disbaled={isDeleting}
              buttonClassName="hover:text-red-500"
              icon={<Trash2 />}
              loading={isDeleting}
            />

            <TooltipButton
              content="Feedback"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/generate/feedback/${interview?.id}`, {
                  replace: true,
                });
              }}
              //disbaled={false}
              disbaled={isDeleting} // Sửa lỗi chính tả và vô hiệu hóa khi đang xóa
              buttonClassName="hover:text-yellow-500"
              icon={<Newspaper />}
              loading={false}
            />

            <TooltipButton
              content="Start"
              buttonVariant={"ghost"}
              onClick={() => {
                navigate(`/generate/interview/${interview?.id}`, {
                  replace: true,
                });
              }}
              //disbaled={false}
              disbaled={isDeleting} // Sửa lỗi chính tả và vô hiệu hóa khi đang xóa
              buttonClassName="hover:text-sky-500"
              icon={<Sparkles />}
              loading={false}
            />
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
