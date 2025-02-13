
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

const VOICES = [
  { id: "alloy", name: "Alloy" },
  { id: "echo", name: "Echo" },
  { id: "fable", name: "Fable" },
  { id: "onyx", name: "Onyx" },
  { id: "nova", name: "Nova" },
  { id: "shimmer", name: "Shimmer" },
];

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("alloy");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to convert to speech",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await supabase.functions.invoke("text-to-speech", {
        body: { text, voice },
      });

      if (response.error) {
        throw new Error(response.error.message || response.error);
      }

      // Play the audio
      const audio = new Audio(response.data.audioUrl);
      audio.play();

      toast({
        title: "Success",
        description: "Audio generated successfully!",
      });
    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Text to Speech</h2>
      
      <div className="space-y-4">
        <Textarea
          placeholder="Enter text to convert to speech..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[100px]"
        />
        
        <Select value={voice} onValueChange={setVoice}>
          <SelectTrigger>
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {VOICES.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button 
          onClick={handleGenerate} 
          disabled={isLoading || !text.trim()}
          className="w-full"
        >
          {isLoading ? "Generating..." : "Generate Speech"}
        </Button>
      </div>
    </div>
  );
};

export default TextToSpeech;
