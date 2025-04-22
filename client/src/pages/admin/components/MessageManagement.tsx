import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, Trash2, Check, MessageSquare, Mail } from "lucide-react";

// Define interface for message data
interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
  consent: boolean;
  createdAt: string;
  isRead: boolean;
}

export default function MessageManagement() {
  const { toast } = useToast();
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Query to get all messages
  const { data: messages, isLoading } = useQuery<Message[]>({
    queryKey: ["/api/admin/messages"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
  });

  // Mutation to mark message as read
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("PUT", `/api/admin/messages/${id}/read`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to mark message as read");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      toast({
        title: "Message marked as read",
        description: "The message has been marked as read",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to mark message as read",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Mutation to delete message
  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admin/messages/${id}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete message");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/messages"] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Message deleted",
        description: "The message has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // View message details
  const viewMessage = (message: Message) => {
    setSelectedMessage(message);
    
    // If message is unread, mark it as read
    if (!message.isRead) {
      markAsReadMutation.mutate(message.id);
    }
    
    setIsViewDialogOpen(true);
  };

  // Confirm message deletion
  const confirmDelete = () => {
    if (selectedMessage) {
      deleteMessageMutation.mutate(selectedMessage.id);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get unread messages count
  const unreadCount = messages?.filter(message => !message.isRead).length || 0;

  return (
    <div>
      {isLoading ? (
        <div className="text-center p-4">Loading messages...</div>
      ) : messages && messages.length > 0 ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {messages.length} messages ({unreadCount} unread)
              </span>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableCaption>List of all contact messages</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id} className={!message.isRead ? "bg-secondary/10" : ""}>
                    <TableCell>
                      {!message.isRead ? (
                        <Badge variant="secondary" className="text-xs">New</Badge>
                      ) : (
                        <Check className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{message.name}</div>
                      <div className="text-sm text-muted-foreground">{message.email}</div>
                    </TableCell>
                    <TableCell>
                      <div className="truncate max-w-[300px]">
                        {message.message.substring(0, 60)}
                        {message.message.length > 60 ? "..." : ""}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(message.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => viewMessage(message)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedMessage(message);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : (
        <div className="text-center p-8 border rounded-lg">
          <MessageSquare className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <h3 className="text-lg font-medium">No messages found</h3>
          <p className="text-muted-foreground">
            Messages from the contact form will appear here
          </p>
        </div>
      )}

      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.name}</DialogTitle>
            <DialogDescription>
              Received on {selectedMessage && formatDate(selectedMessage.createdAt)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">From:</h4>
                <p>{selectedMessage.name} &lt;{selectedMessage.email}&gt;</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Message:</h4>
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Consent:</h4>
                <p>{selectedMessage.consent ? "Has given consent" : "No consent given"}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                setIsViewDialogOpen(false);
                setIsDeleteDialogOpen(true);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message from
              <span className="font-medium"> {selectedMessage?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={deleteMessageMutation.isPending}
            >
              {deleteMessageMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}