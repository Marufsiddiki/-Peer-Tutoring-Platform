import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Play, Pause, Volume2, Maximize, Video, CheckCircle2, Award } from 'lucide-react';

export const VideoPlayerModal: React.FC = () => {
  const { videoPlayerModalOpen, setVideoPlayerModalOpen, videoToPlay, setVideoToPlay } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);

  if (!videoPlayerModalOpen || !videoToPlay) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-slate-900 rounded-2xl border border-slate-700 max-w-2xl w-full shadow-2xl overflow-hidden text-white">
        {/* Top bar */}
        <div className="p-4 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-xs truncate max-w-md">{videoToPlay.title}</h3>
              <p className="text-[10px] text-slate-400">Campus Verified Peer Teaching Demonstration</p>
            </div>
          </div>

          <button
            onClick={() => {
              setVideoPlayerModalOpen(false);
              setVideoToPlay(null);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Screen Mock */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 flex flex-col items-center justify-center p-6 text-center select-none">
          {/* Simulated Whiteboard / Slide Screen */}
          <div className="w-full h-full border border-teal-500/30 rounded-xl bg-slate-900/80 p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3 text-xs">
              <div className="flex items-center gap-2 text-teal-400 font-mono font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                DEMO CLASS: {videoToPlay.topic}
              </div>
              <span className="text-[10px] text-slate-400 font-mono">1080p 60fps • High Definition</span>
            </div>

            {/* Whiteboard visual diagram */}
            <div className="my-auto space-y-3">
              <div className="text-sm sm:text-base font-bold text-white tracking-wide">
                "{videoToPlay.title}"
              </div>
              <div className="text-xs text-teal-200/80 max-w-md mx-auto">
                Step-by-step whiteboard walkthrough, time complexity proofs, and live code breakdown.
              </div>

              {/* Code snippet simulation */}
              <div className="bg-slate-950/80 rounded-lg p-3 text-left font-mono text-[11px] text-teal-300 max-w-sm mx-auto border border-teal-500/20 shadow-inner">
                <div><code>void solveGraphProblem(Node* root) &#123;</code></div>
                <div className="pl-4"><code>priority_queue&lt;Pair&gt; pq;</code></div>
                <div className="pl-4"><code>pq.push(&#123;0, root&#125;); // Greedy Step</code></div>
                <div><code>&#125;</code></div>
              </div>
            </div>

            {/* Simulated player controls */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-700/60">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white transition"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                </button>
                <span className="font-mono text-[11px] text-slate-300">03:42 / 11:20</span>
                <Volume2 className="w-4 h-4 text-slate-400" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-teal-900/60 text-teal-300 px-2 py-0.5 rounded border border-teal-700/50">
                  Verified Teaching Skill
                </span>
                <Maximize className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Video metadata footer */}
        <div className="p-4 bg-slate-800 text-xs flex items-center justify-between">
          <div>
            <div className="font-semibold text-white">Topic: {videoToPlay.topic}</div>
            <div className="text-[11px] text-slate-400">
              External link: <span className="font-mono text-teal-400">{videoToPlay.url}</span>
            </div>
          </div>
          <button
            onClick={() => {
              setVideoPlayerModalOpen(false);
              setVideoToPlay(null);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold transition"
          >
            Close Video
          </button>
        </div>
      </div>
    </div>
  );
};
