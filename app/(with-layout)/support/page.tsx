'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ContactFormInput, contactFormSchema } from '@/lib/validations';
import { useProfileQuery } from '@/queries/auth';
import { useSubmitContactFormMutation } from '@/queries/contact';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Clock,
  HelpCircle,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function SupportPage() {
  const [submitContactForm, { isLoading: isSubmitting }] =
    useSubmitContactFormMutation();

  const { data: user } = useProfileQuery();

  const messages = [
    {
      id: '1',
      subject: 'Issue with device connectivity',
      message: 'My IoT device is not connecting to the network.',
      createdAt: '2024-10-01T10:00:00Z',
      response: '',
    },
    {
      id: '2',
      subject: 'Billing question',
      message: 'I have a question about my latest invoice.',
      createdAt: '2024-09-28T14:30:00Z',
      response:
        'We are looking into your billing question and will get back to you shortly.',
    },
    {
      id: '3',
      subject: 'Feature request for dashboard',
      message: 'It would be great to have a dark mode option.',
      createdAt: '2024-09-20T09:15:00Z',
      response:
        'Thank you for your suggestion! Dark mode has been added to our roadmap.',
    },
  ];

  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: user?.last_name + ' ' + user?.last_name,
      email: user?.email,
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormInput) => {
    try {
      await submitContactForm(data).unwrap();
      toast.success('Message sent successfully!', {
        description: "We'll get back to you within 24 hours.",
      });
      form.reset();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error('Failed to send message', {
        description: error?.data?.message || 'Please try again later.',
      });
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg">
            <HelpCircle className="text-primary h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Support Center
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Get help and support for your IoT devices
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <Card className="gap-2 pb-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 items-start space-y-4 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  support@iothub.com
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  +8801568-816822
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">Business Hours</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sun-Web: 9:00 AM - 3:00 PM
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  3114, Shahjalal University of Science and Technology
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        {/* Contact Form  + previous message*/}
        {user?.role !== 'superadmin' && (
          <>
            {/* Contact Form  + message*/}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Contact Us
                </CardTitle>
                <CardDescription>
                  Having issues? Send us a message and we&apos;ll help you
                  resolve them quickly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        {...form.register('name')}
                        disabled
                      />
                      {form.formState.errors.name && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        disabled
                        placeholder="Enter your email"
                        {...form.register('email')}
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-600">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue"
                      {...form.register('subject')}
                    />
                    {form.formState.errors.subject && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Describe your issue in detail..."
                      rows={6}
                      {...form.register('message')}
                    />
                    {form.formState.errors.message && (
                      <p className="text-sm text-red-600">
                        {form.formState.errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Your Previous Messages</CardTitle>
                <CardDescription>
                  Track the status of your support requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages?.length > 0 ? (
                    messages.map((message) => (
                      <div key={message.id} className="rounded-lg border p-4">
                        <div className="mb-2 flex items-start justify-between">
                          <h4 className="font-medium">{message.subject}</h4>
                          <div>
                            {new Date(message.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                          {message.message}
                        </p>

                        {message.response && (
                          <div className="mt-3 rounded border-l-4 border-green-500 bg-green-50 p-3 dark:bg-green-900/20">
                            <p className="mb-1 text-sm font-medium text-green-800 dark:text-green-300">
                              Response:
                            </p>
                            <p className="text-sm text-green-700 dark:text-green-400">
                              {message.response}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-2 text-center text-gray-500">
                      No previous messages found.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* messages  */}
        {user?.role === 'superadmin' && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                View and respond to user messages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <h4 className="font-medium">
                        {message.subject}
                        <span className="ml-2 text-sm text-gray-500">
                          {'<'}abc@gmail.com{'>'}
                        </span>
                      </h4>
                      <div>
                        {new Date(message.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                      {message.message}
                    </p>

                    {message.response && (
                      <div className="mt-3 rounded border-l-4 border-green-500 bg-green-50 p-3 dark:bg-green-900/20">
                        <p className="mb-1 text-sm font-medium text-green-800 dark:text-green-300">
                          Response:
                        </p>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          {message.response}
                        </p>
                      </div>
                    )}

                    <div className="mt-3 flex gap-4 space-y-2">
                      <Input id="reply" placeholder="Reply the message" />
                      <div>
                        <Button type="submit" className="w-full">
                          <Send className="mr-2 h-4 w-4" />
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
