import React, { useState, useEffect } from "react";
import { format, parseISO, startOfToday } from "date-fns";
import { Lock, Trash2, Plus, Calendar as CalendarIcon, ArrowLeft, Clock } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { AVAILABLE_TIME_SLOTS } from "../config";
import { db } from "../firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export type BlockedSlotsRecord = Record<string, string[]>;

export function AdminDashboard({ onBack }: { onBack: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlotsRecord>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("ALL");

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await fetch(`/api/blocked-slots?_t=${Date.now()}`);
        if (res.ok) {
          const data = await res.json();
          setBlockedSlots(data);
        }
      } catch (e) {
        console.error("Could not load blocked slots from fallback", e);
      }
    };

    let unsubscribe = () => {};
    try {
      const docRef = doc(db, "config", "blocked-slots");
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setBlockedSlots(docSnap.data().slots || {});
        } else {
          fetchSlots();
        }
      }, (error) => {
        console.warn("Firestore listener failed in AdminDashboard, falling back:", error);
        fetchSlots();
      });
    } catch (err) {
      console.warn("Failed to set up Firestore listener in AdminDashboard, falling back:", err);
      fetchSlots();
    }

    return () => unsubscribe();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "durham123" || password === "admin") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const saveBlockedSlots = async (slots: BlockedSlotsRecord) => {
    setBlockedSlots(slots);

    // 1. Write to Firestore directly
    try {
      const docRef = doc(db, "config", "blocked-slots");
      await setDoc(docRef, { slots });
      console.log("Successfully saved slots directly to Firestore.");
    } catch (e) {
      console.error("Failed to save to Firestore directly, trying backend api...", e);
    }

    // 2. Also save to server API to keep local JSON fallback in sync
    try {
      await fetch("/api/blocked-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slots)
      });
    } catch (e) {
      console.error("Failed to save blocked slots fallback", e);
    }
  };

  const handleBlockSlot = () => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const currentBlocks = blockedSlots[dateStr] || [];
    
    let newBlocks;
    if (selectedTime === "ALL") {
      newBlocks = ["ALL"];
    } else {
      if (currentBlocks.includes("ALL")) {
        // Already blocked whole day, do nothing or replace
        newBlocks = [selectedTime];
      } else if (!currentBlocks.includes(selectedTime)) {
        newBlocks = [...currentBlocks, selectedTime];
      } else {
        newBlocks = currentBlocks;
      }
    }
    
    const newSlots = { ...blockedSlots, [dateStr]: newBlocks };
    saveBlockedSlots(newSlots);
  };

  const handleRemoveDate = (dateStr: string) => {
    const newSlots = { ...blockedSlots };
    delete newSlots[dateStr];
    saveBlockedSlots(newSlots);
  };

  const handleRemoveSlot = (dateStr: string, time: string) => {
    const currentBlocks = blockedSlots[dateStr] || [];
    if (currentBlocks.includes("ALL")) {
      // If it "ALL" was blocked, and we remove one slot, we should block the other slots?
      // For simplicity, just remove the entire date block if they remove "ALL"
      handleRemoveDate(dateStr);
    } else {
      const newBlocks = currentBlocks.filter(t => t !== time);
      if (newBlocks.length === 0) {
        handleRemoveDate(dateStr);
      } else {
        saveBlockedSlots({ ...blockedSlots, [dateStr]: newBlocks });
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex flex-col justify-center items-center px-4">
        <div className="max-w-md w-full bg-zinc-950 p-8 border border-zinc-800 rounded-lg shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="bg-gold-500/10 p-4 rounded-full border border-gold-500/20">
              <Lock className="w-8 h-8 text-gold-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold font-heading text-white text-center mb-6">Admin Access</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full border-0 bg-zinc-900 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm"
                placeholder="Enter admin password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gold-500 text-black font-semibold py-3 px-4 hover:bg-gold-400 transition-colors"
            >
              Login
            </button>
          </form>
          
          <button 
            onClick={onBack}
            className="mt-6 text-zinc-500 hover:text-white text-sm flex items-center justify-center w-full transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800">
          <div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-zinc-400 text-sm">Manage your schedule and blocked time slots</p>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center text-sm font-medium text-gold-500 hover:bg-gold-500/10 px-4 py-2 rounded-full transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Exit Admin
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Calendar Selection Area */}
          <div className="lg:col-span-1 bg-zinc-950 border border-zinc-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold font-heading mb-4 flex items-center">
              <CalendarIcon className="w-5 h-5 mr-3 text-gold-500" />
              Select Date to Block
            </h2>
            
            <div className="bg-zinc-950 border border-zinc-800 rounded-sm p-4 mb-6 flex justify-center custom-calendar-wrapper">
              <style>
                {`
                  .custom-calendar-wrapper .rdp {
                    --rdp-accent-color: #D4AF37;
                    --rdp-background-color: rgba(212, 175, 55, 0.1);
                    --rdp-day_button: 40px;
                    --rdp-selected-border: 2px solid var(--rdp-accent-color);
                    --rdp-outline: 2px solid var(--rdp-accent-color);
                    margin: 0;
                  }
                  .custom-calendar-wrapper .rdp-day_selected, 
                  .custom-calendar-wrapper .rdp-selected,
                  .custom-calendar-wrapper .rdp-day_selected:focus-visible, 
                  .custom-calendar-wrapper .rdp-selected:focus-visible,
                  .custom-calendar-wrapper .rdp-day_selected:hover,
                  .custom-calendar-wrapper .rdp-selected:hover {
                    color: black !important;
                    background-color: var(--rdp-accent-color) !important;
                  }
                  .custom-calendar-wrapper .rdp-button:hover:not([disabled]):not(.rdp-day_selected):not(.rdp-selected) {
                     background-color: var(--rdp-background-color);
                  }
                  .custom-calendar-wrapper .rdp-day_disabled {
                     opacity: 0.3;
                  }
                  .custom-calendar-wrapper .rdp-day_fullyBlocked {
                    color: #ef4444 !important;
                    text-decoration: line-through;
                    font-weight: bold;
                  }
                `}
              </style>
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < startOfToday()}
                modifiers={{ fullyBlocked: Object.keys(blockedSlots).filter(d => blockedSlots[d].includes("ALL")).map(d => parseISO(d)) }}
                modifiersClassNames={{ fullyBlocked: "rdp-day_fullyBlocked" }}
                className="text-white"
              />
            </div>

            {selectedDate && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-400 mb-2">Select Time to Block</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="block w-full border-0 bg-zinc-900 px-4 py-3 text-white shadow-sm ring-1 ring-inset ring-zinc-800 focus:ring-2 focus:ring-inset focus:ring-gold-500 sm:text-sm"
                >
                  <option value="ALL">Block Whole Day</option>
                  {AVAILABLE_TIME_SLOTS.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            )}
            
            <button
              onClick={handleBlockSlot}
              disabled={!selectedDate}
              className="w-full flex justify-center items-center bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-semibold py-3 px-4 rounded-sm transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              {selectedDate ? `Block Selected${selectedTime !== "ALL" ? " Time" : " Day"}` : "Select a date first"}
            </button>
          </div>

          {/* Blocked Dates List */}
          <div className="lg:col-span-2 bg-zinc-950 border border-zinc-800 p-6 rounded-lg">
            <h2 className="text-xl font-bold font-heading mb-6">Currently Blocked Dates & Times</h2>
            
            {Object.keys(blockedSlots).length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-lg">
                <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-500">No time slots are currently blocked.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {Object.keys(blockedSlots).sort().map((dateStr) => {
                   const slots = blockedSlots[dateStr];
                   const isAll = slots.includes("ALL");
                   
                   return (
                    <div key={dateStr} className="flex flex-col bg-black border border-zinc-800 p-4 rounded-md group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-white text-lg">{format(parseISO(dateStr), "EEEE, MMMM do, yyyy")}</span>
                        </div>
                        {isAll && (
                          <button
                            onClick={() => handleRemoveDate(dateStr)}
                            className="text-zinc-600 hover:text-red-500 hover:bg-zinc-900 p-2 rounded transition-colors"
                            title="Unblock Whole Day"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      {isAll ? (
                        <div className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-2 rounded-sm text-sm font-medium w-full text-center">
                          Entire Day Blocked
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {slots.map(t => (
                            <div key={t} className="flex items-center bg-zinc-900 border border-zinc-800 rounded-sm text-sm">
                              <span className="px-3 py-1.5 text-zinc-300">{t}</span>
                              <button
                                onClick={() => handleRemoveSlot(dateStr, t)}
                                className="p-1.5 border-l border-zinc-800 hover:bg-zinc-800 hover:text-red-400 text-zinc-500 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-8 bg-gold-500/5 border border-gold-500/20 rounded-lg p-4">
              <p className="text-sm text-gold-400">
                <strong>Note:</strong> Blocked slots are distributed via the live server and stored persistently.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
