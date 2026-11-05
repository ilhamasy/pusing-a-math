"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Download, Copy, Check, Loader2, AlertCircle } from "lucide-react";
import { toPng, toBlob } from "html-to-image";
import { ScoreSummary } from "@/lib/scoring";
import { QuizSettings } from "@/types/quiz";
import { ReportCardTemplate } from "./ReportCardTemplate";
import { sounds } from "@/lib/sound";

interface ShareReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: ScoreSummary;
  settings: QuizSettings;
}

export function ShareReportModal({
  isOpen,
  onClose,
  summary,
  settings,
}: ShareReportModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [canNativeShareFile, setCanNativeShareFile] = useState(false);

  const appUrl = "https://pusing-a-math.vercel.app/";

  // Generate Image
  const generateImage = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      // Small delay to ensure styles and webfonts are applied
      await new Promise((resolve) => setTimeout(resolve, 150));

      const pngUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2, // 2x sharp resolution
        quality: 0.95,
      });

      const blob = await toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        quality: 0.95,
      });

      setImageUrl(pngUrl);
      setImageBlob(blob);

      // Check if navigator.canShare supports files
      if (blob && typeof navigator !== "undefined" && navigator.canShare) {
        try {
          const testFile = new File([blob], "pusing-a-math-report.png", { type: "image/png" });
          const isShareable = navigator.canShare({ files: [testFile] });
          setCanNativeShareFile(isShareable);
        } catch {
          setCanNativeShareFile(false);
        }
      }
    } catch (err) {
      console.error("Error generating report image:", err);
      setErrorMessage("Gagal membuat gambar report. Silakan coba lagi atau salin tautan.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setImageUrl(null);
      setImageBlob(null);
      setErrorMessage(null);
      setCopiedLink(false);
      // Wait for DOM to mount then generate
      const timer = setTimeout(() => {
        generateImage();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen, generateImage]);

  // Social Share Action
  const handleShare = async () => {
    sounds.playPop();

    if (!imageBlob) {
      await generateImage();
    }

    const shareTitle = "Pusing A Math — Astronaut Rank Report";
    const shareText = `Saya mendapatkan rank ${summary.astronautRank.rank} (${summary.score}/100) di Pusing A Math! 🚀 I challenge you to complete this quiz!`;

    // Try Web Share API with File
    if (imageBlob && typeof navigator !== "undefined" && navigator.share) {
      try {
        const file = new File([imageBlob], `pusing-a-math-${summary.astronautRank.rank.toLowerCase().replace(/\s+/g, "-")}.png`, {
          type: "image/png",
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: shareTitle,
            text: shareText,
            url: appUrl,
            files: [file],
          });
          return;
        }

        // Web Share text fallback
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: appUrl,
        });
        return;
      } catch (err: unknown) {
        // User cancelled share or abort error
        if ((err as Error)?.name !== "AbortError") {
          console.warn("Share API fallback to download:", err);
          handleDownload();
        }
        return;
      }
    }

    // Fallback if Web Share is not available
    handleDownload();
  };

  // Download Fallback
  const handleDownload = () => {
    sounds.playPop();
    if (!imageUrl) return;

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `pusing-a-math-${summary.astronautRank.rank.toLowerCase().replace(/\s+/g, "-")}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Link Fallback
  const handleCopyLink = async () => {
    sounds.playPop();
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback prompt
      window.prompt("Salin link ini:", appUrl);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg rounded-3xl bg-[#0D1230] border-2 border-white/20 p-4 sm:p-6 shadow-2xl flex flex-col items-center my-auto max-h-[92vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              type="button"
              id="btn-close-share-modal"
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center mt-1 mb-3">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Bagikan Pencapaianmu! 🚀
              </h3>
            </div>

            {/* Hidden Off-Screen Card Template for Image Capture */}
            <div style={{ position: "fixed", left: -9999, top: -9999 }}>
              <ReportCardTemplate
                summary={summary}
                settings={settings}
                cardRef={cardRef}
              />
            </div>

            {/* Live Image Preview Area */}
            <div className="w-full flex items-center justify-center my-2 min-h-[260px] sm:min-h-[320px] rounded-2xl bg-[#070A1E] border border-white/10 p-2 relative overflow-hidden">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center gap-3 text-white/80 p-8">
                  <Loader2 className="w-8 h-8 animate-spin text-[#40B9FF]" />
                  <span className="text-sm font-bold animate-pulse">
                    Mempersiapkan Kartu Laporan Antariksa... 🛰️
                  </span>
                </div>
              ) : errorMessage ? (
                <div className="flex flex-col items-center justify-center gap-2 text-rose-300 p-6 text-center">
                  <AlertCircle className="w-8 h-8 text-rose-400" />
                  <span className="text-xs sm:text-sm font-semibold">{errorMessage}</span>
                  <button
                    onClick={generateImage}
                    type="button"
                    className="mt-2 text-xs text-[#FFD166] underline font-bold"
                  >
                    Coba Generate Ulang
                  </button>
                </div>
              ) : imageUrl ? (
                <div className="w-full max-w-[280px] sm:max-w-[320px] rounded-xl overflow-hidden shadow-2xl border border-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Astronaut Rank Report Card"
                    className="w-full h-auto object-cover select-none"
                  />
                </div>
              ) : null}
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-2.5 mt-4">
              {/* Primary: Share / Download */}
              <button
                onClick={handleShare}
                disabled={isGenerating}
                type="button"
                id="btn-confirm-share"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#45D6A0] via-[#40B9FF] to-[#8175FF] text-[#052818] font-black text-base sm:text-lg shadow-xl shadow-[#45D6A0]/30 border-2 border-white/40 cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none"
              >
                {canNativeShareFile ? (
                  <>
                    <Share2 className="w-5 h-5 stroke-[2.5]" />
                    <span>Bagikan Gambar Sekarang</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 stroke-[2.5]" />
                    <span>Download Gambar Report</span>
                  </>
                )}
              </button>

              {/* Secondary Options Grid: Download & Copy Link */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleDownload}
                  disabled={!imageUrl || isGenerating}
                  type="button"
                  id="btn-download-report"
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Download className="w-4 h-4 text-[#40B9FF]" />
                  <span>Download PNG</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  type="button"
                  id="btn-copy-link"
                  className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs sm:text-sm border border-white/15 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-[#45D6A0]" />
                      <span className="text-[#45D6A0]">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#FFD166]" />
                      <span>Salin Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
