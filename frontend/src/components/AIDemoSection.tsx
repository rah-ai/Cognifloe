import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, MessageSquare, Sparkles, ThumbsUp, ThumbsDown, Minus, FileText, Check, Upload, Eye } from "lucide-react";
import { GlassCard } from "./ui/GlassCard";
import { Button3D } from "./ui/Button3D";

interface AIResult {
    type: "sentiment" | "keywords" | "summary" | "vision";
    sentiment?: "positive" | "neutral" | "negative";
    score?: number;
    keywords?: string[];
    summary?: string;
    labels?: { name: string; confidence: number }[];
    extractedText?: string;
}

export default function AIDemoSection() {
    const [inputText, setInputText] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<AIResult | null>(null);
    const [activeDemo, setActiveDemo] = useState<"sentiment" | "keywords" | "summary" | "vision">("sentiment");
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handle image upload
    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
                setResult(null);
            };
            reader.readAsDataURL(file);
        }
    }, []);

    // Process image (simulated)
    const processImage = useCallback(async () => {
        if (!uploadedImage) return;

        setIsProcessing(true);
        setResult(null);

        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulated vision AI results
        const possibleLabels = [
            { name: "Document", confidence: 94 },
            { name: "Invoice", confidence: 87 },
            { name: "Text Content", confidence: 92 },
            { name: "Business Form", confidence: 78 },
            { name: "Receipt", confidence: 65 },
            { name: "Table Data", confidence: 71 }
        ];

        // Randomly select 3-4 labels
        const shuffled = possibleLabels.sort(() => 0.5 - Math.random());
        const selectedLabels = shuffled.slice(0, 3 + Math.floor(Math.random() * 2));

        // Simulated OCR text
        const extractedText = "INVOICE #2024-001\nDate: January 5, 2026\nAmount: $1,234.56\nVendor: CogniFloe AI Services";

        setResult({
            type: "vision",
            labels: selectedLabels,
            extractedText
        });

        setIsProcessing(false);
    }, [uploadedImage]);

    // Simulate AI processing for text
    const processText = useCallback(async () => {
        if (!inputText.trim()) return;

        setIsProcessing(true);
        setResult(null);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const text = inputText.toLowerCase();

        if (activeDemo === "sentiment") {
            const positiveWords = ["great", "awesome", "excellent", "love", "amazing", "good", "happy", "wonderful", "fantastic", "best"];
            const negativeWords = ["bad", "terrible", "awful", "hate", "horrible", "worst", "sad", "angry", "disappointing", "poor"];

            const positiveCount = positiveWords.filter(w => text.includes(w)).length;
            const negativeCount = negativeWords.filter(w => text.includes(w)).length;

            let sentiment: "positive" | "neutral" | "negative" = "neutral";
            let score = 50;

            if (positiveCount > negativeCount) {
                sentiment = "positive";
                score = 70 + Math.min(positiveCount * 5, 25);
            } else if (negativeCount > positiveCount) {
                sentiment = "negative";
                score = 30 - Math.min(negativeCount * 5, 25);
            }

            setResult({ type: "sentiment", sentiment, score });
        } else if (activeDemo === "keywords") {
            const words = text.split(/\s+/)
                .filter(w => w.length > 3)
                .filter(w => !["this", "that", "with", "from", "have", "been", "were", "they", "their", "will", "would", "could", "should"].includes(w));

            const wordCount: Record<string, number> = {};
            words.forEach(w => {
                wordCount[w] = (wordCount[w] || 0) + 1;
            });

            const keywords = Object.entries(wordCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([word]) => word);

            setResult({ type: "keywords", keywords: keywords.length > 0 ? keywords : ["No keywords found"] });
        } else if (activeDemo === "summary") {
            const sentences = inputText.split(/[.!?]+/).filter(s => s.trim());
            const summary = sentences[0]?.trim() || inputText.slice(0, 100);

            setResult({
                type: "summary",
                summary: summary.length > 80 ? summary.slice(0, 77) + "..." : summary + "..."
            });
        }

        setIsProcessing(false);
    }, [inputText, activeDemo]);

    const getSentimentIcon = () => {
        if (!result || result.type !== "sentiment") return null;
        switch (result.sentiment) {
            case "positive": return <ThumbsUp className="w-8 h-8 text-forest-500" />;
            case "negative": return <ThumbsDown className="w-8 h-8 text-coral-500" />;
            default: return <Minus className="w-8 h-8 text-amber-500" />;
        }
    };

    const getSentimentColor = () => {
        if (!result || result.type !== "sentiment") return "bg-muted";
        switch (result.sentiment) {
            case "positive": return "bg-forest-500";
            case "negative": return "bg-coral-500";
            default: return "bg-amber-500";
        }
    };

    return (
        <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neural-purple/10">
                        <Brain className="w-5 h-5 text-neural-purple" />
                    </div>
                    <div>
                        <h3 className="font-bold text-foreground">AI Demo</h3>
                        <p className="text-xs text-muted-foreground">Try our AI capabilities</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-neural-purple/10 border border-neural-purple/20">
                    <Sparkles className="w-3 h-3 text-neural-purple" />
                    <span className="text-xs text-neural-purple font-medium">Live</span>
                </div>
            </div>

            {/* Demo Type Selector */}
            <div className="flex gap-1.5 flex-wrap">
                {[
                    { id: "sentiment", label: "Sentiment", icon: MessageSquare },
                    { id: "keywords", label: "Keywords", icon: Zap },
                    { id: "summary", label: "Summary", icon: FileText },
                    { id: "vision", label: "Vision AI", icon: Eye }
                ].map((demo) => (
                    <button
                        key={demo.id}
                        onClick={() => { setActiveDemo(demo.id as any); setResult(null); }}
                        className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${activeDemo === demo.id
                            ? "bg-neural-purple/20 text-neural-purple border border-neural-purple/30"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted"
                            }`}
                    >
                        <demo.icon className="w-3 h-3" />
                        {demo.label}
                    </button>
                ))}
            </div>

            {/* Input - Text or Image based on mode */}
            {activeDemo !== "vision" ? (
                <>
                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder={
                            activeDemo === "sentiment"
                                ? "Type something to analyze sentiment..."
                                : activeDemo === "keywords"
                                    ? "Enter text to extract keywords..."
                                    : "Enter text to summarize..."
                        }
                        className="w-full p-3 rounded-lg bg-muted/50 border border-border focus:border-neural-purple/50 focus:ring-2 focus:ring-neural-purple/20 outline-none resize-none h-20 text-sm"
                    />

                    <Button3D
                        variant="organic"
                        size="sm"
                        className="w-full"
                        onClick={processText}
                        isLoading={isProcessing}
                        disabled={!inputText.trim()}
                        leftIcon={<Zap className="w-4 h-4" />}
                    >
                        {isProcessing ? "Processing..." : "Analyze Text"}
                    </Button3D>
                </>
            ) : (
                <>
                    {/* Image Upload Area */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />

                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${uploadedImage
                            ? "border-neural-purple/50 bg-neural-purple/5"
                            : "border-border hover:border-neural-purple/30 hover:bg-muted/30"
                            }`}
                        style={{ minHeight: "100px" }}
                    >
                        {uploadedImage ? (
                            <img
                                src={uploadedImage}
                                alt="Uploaded"
                                className="max-h-20 rounded-lg object-contain"
                            />
                        ) : (
                            <>
                                <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                                <p className="text-xs text-muted-foreground text-center">
                                    Click to upload an image<br />
                                    <span className="text-neural-purple">OCR + Classification</span>
                                </p>
                            </>
                        )}
                    </div>

                    <Button3D
                        variant="organic"
                        size="sm"
                        className="w-full"
                        onClick={processImage}
                        isLoading={isProcessing}
                        disabled={!uploadedImage}
                        leftIcon={<Eye className="w-4 h-4" />}
                    >
                        {isProcessing ? "Analyzing Image..." : "Analyze Image"}
                    </Button3D>
                </>
            )}

            {/* Results */}
            <AnimatePresence mode="wait">
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-lg bg-muted/30 border border-border"
                    >
                        {result.type === "sentiment" && (
                            <div className="flex items-center gap-4">
                                <div className={`w-16 h-16 rounded-full ${getSentimentColor()}/10 flex items-center justify-center`}>
                                    {getSentimentIcon()}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground capitalize">
                                        {result.sentiment} Sentiment
                                    </p>
                                    <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                                        <motion.div
                                            className={getSentimentColor()}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${result.score}%` }}
                                            transition={{ duration: 0.5 }}
                                            style={{ height: "100%" }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Confidence: {result.score}%
                                    </p>
                                </div>
                            </div>
                        )}

                        {result.type === "keywords" && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-2">Extracted Keywords:</p>
                                <div className="flex flex-wrap gap-2">
                                    {result.keywords?.map((kw, i) => (
                                        <motion.span
                                            key={kw}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="px-3 py-1 rounded-full bg-neural-purple/10 text-neural-purple text-xs font-medium border border-neural-purple/20"
                                        >
                                            {kw}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {result.type === "summary" && (
                            <div>
                                <p className="text-xs text-muted-foreground mb-2">
                                    <Check className="w-3 h-3 inline mr-1" />
                                    AI Summary:
                                </p>
                                <p className="text-sm text-foreground italic">
                                    "{result.summary}"
                                </p>
                            </div>
                        )}

                        {result.type === "vision" && (
                            <div className="space-y-4">
                                {/* Classification Labels */}
                                <div>
                                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        Classification Results:
                                    </p>
                                    <div className="space-y-2">
                                        {result.labels?.map((label, i) => (
                                            <motion.div
                                                key={label.name}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-center gap-2"
                                            >
                                                <span className="text-xs text-foreground w-24 truncate">{label.name}</span>
                                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-neural-purple to-sunset-500 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${label.confidence}%` }}
                                                        transition={{ duration: 0.5, delay: i * 0.1 }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-neural-purple w-10">{label.confidence}%</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* OCR Text */}
                                <div>
                                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                                        <FileText className="w-3 h-3" />
                                        Extracted Text (OCR):
                                    </p>
                                    <div className="p-2 rounded-lg bg-muted/50 border border-border">
                                        <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">
                                            {result.extractedText}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </GlassCard>
    );
}
