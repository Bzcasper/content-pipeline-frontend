import * as React from "react"
import { useFormContext } from "react-hook-form"

import { cn } from "@/lib/utils"

const Form = React.forwardRef<HTMLFormElement, React.HTMLAttributes<HTMLFormElement>>(
  ({ className, ...props }, ref) => (
    <form ref={ref} className={cn("space-y-8", className)} {...props} />
  )
)
Form.displayName = "Form"

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("relative", className)} {...props} />
))
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
FormDescription.displayName = "FormDescription"

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  control: any;
  name: string;
  children: React.ReactNode;
}

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  control: any;
  name: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = 
  ({ className, control, name, children, ...props }) => {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    );
  };
FormField.displayName = "FormField";

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const FormItem: React.FC<FormItemProps> = 
  ({ className, children, ...props }) => {
    return (
      <div className={cn("space-y-1.5", className)} {...props}>
        {children}
      </div>
    );
  };
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
FormLabel.displayName = "FormLabel";

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  id: string;
  className?: string;
}

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, id, ...props }, ref) => {
    const { formState } = useFormContext();
    return formState.errors[id] ? (
      <p
        ref={ref}
        className={cn("text-sm font-medium text-destructive", className)}
        {...props}
      >
        {formState.errors[id]?.message as string}
      </p>
    ) : null;
  }
);
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
}
