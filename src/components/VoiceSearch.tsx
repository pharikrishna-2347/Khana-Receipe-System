
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface VoiceSearchProps {
  onSearchResult: (text: string) => void;
  disabled?: boolean;
}

const VoiceSearch = ({ onSearchResult, disabled = false }: VoiceSearchProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      setMediaRecorder(recorder);
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
          await processAudio(audioBlob);
        } else {
          setIsProcessing(false);
          toast.error("No audio recorded. Please try again.");
        }
      };

      recorder.start();
      setIsRecording(true);
      toast.info("Recording started. Speak clearly and then click to stop.");
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error("Could not access microphone. Please check permissions and try again.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setIsProcessing(true);
      toast.info("Processing your voice...");
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      console.log('Processing audio blob:', audioBlob.size, 'bytes,', audioBlob.type);
      
      if (audioBlob.size === 0) {
        throw new Error('Empty audio recording');
      }
      
      // Convert blob to base64
      const base64Audio = await blobToBase64(audioBlob);
      
      if (!base64Audio) {
        throw new Error('Failed to convert audio to base64');
      }

      console.log('Sending audio data to voice-to-text function, data length:', base64Audio.length);
      
      // Use supabase client to invoke the edge function
      const { data, error } = await supabase.functions.invoke('voice-to-text', {
        body: { audio: base64Audio }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Function error: ${error.message}`);
      }
      
      console.log('Voice-to-text response:', data);
      
      if (!data) {
        throw new Error('Empty response from voice-to-text function');
      }
      
      if (data.text) {
        onSearchResult(data.text);
        toast.success(`Voice search: "${data.text}"`);
      } else {
        toast.warning("No speech detected. Please try again and speak clearly.");
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error(`Failed to process voice: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper function to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString() || '';
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = () => reject(new Error('Failed to read blob'));
      reader.readAsDataURL(blob);
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing || disabled}
      className="relative dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700/50"
      aria-label={isRecording ? "Stop recording" : "Start voice search"}
      title={isRecording ? "Stop recording" : "Search with your voice"}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isRecording ? (
        <MicOff className="h-4 w-4 text-destructive" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
};

export default VoiceSearch;
