'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import * as Switch from '@radix-ui/react-switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Copy, Loader2, RefreshCcw } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId));
  };

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async () => {
    if (typeof window === 'undefined') return; // Prevent execution on the server
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.messages || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch messages',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!session?.user) return;

    fetchMessages();
    fetchAcceptMessages();
  }, [session, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: 'Settings Updated',
        description: `Message acceptance is now ${!acceptMessages ? 'On' : 'Off'}`,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to update settings',
        variant: 'destructive',
      });
    }
  };

  const baseUrl =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//${window.location.host}`
      : '';
  const profileUrl =
    session?.user?.username && baseUrl ? `${baseUrl}/u/${session.user.username}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Your profile URL has been copied to the clipboard.',
    });
  };

  if (session === undefined) return <div>Loading session...</div>;
  if (!session?.user) return <div>Loading...</div>;

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-gray-900 rounded-lg shadow-lg w-full max-w-5xl">
      <h1 className="text-4xl font-extrabold text-white mb-6">
        Welcome Back, {session.user.username}!
      </h1>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-200 mb-2">Your Shareable Profile Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            readOnly
            className="w-full p-3 bg-gray-800 text-gray-200 rounded-l-lg border border-gray-700"
          />
          <Button
            onClick={copyToClipboard}
            className="bg-blue-600 text-white rounded-r-lg hover:bg-blue-700"
          >
            <Copy className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <Switch.Root
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
          className="relative w-[42px] h-[25px] bg-gray-500 rounded-full shadow-md focus:ring-2 focus:ring-black transition-colors data-[state=checked]:bg-black"
        >
          <Switch.Thumb
            className="block w-[21px] h-[21px] bg-white rounded-full shadow-sm transition-transform transform translate-x-[2px] data-[state=checked]:translate-x-[19px]"
          />
        </Switch.Root>
        <span className="ml-3 text-gray-200">
          Accept Messages: <strong>{acceptMessages ? 'Enabled' : 'Disabled'}</strong>
        </span>
      </div>

      <Separator className="mb-6 border-gray-600" />

      <Button
        onClick={fetchMessages}
        disabled={isLoading}
        className="bg-green-600 text-white hover:bg-green-700 mb-6"
      >
        {isLoading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <RefreshCcw className="w-5 h-5" />
        )}
        Refresh Messages
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p className="text-gray-400">No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
