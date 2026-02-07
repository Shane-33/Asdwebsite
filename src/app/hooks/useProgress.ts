import { useState, useEffect } from "react";

const STORAGE_KEY = "east-progress";

interface ProgressData {
  completedSections: string[];
  currentSection: string;
  quizScores: Record<string, number>;
  lastVisited: string;
}

export function useProgress() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState<string>("intro");
  const [quizScores, setQuizScores] = useState<Record<string, number>>({});

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const data: ProgressData = JSON.parse(savedProgress);
        setCompletedSections(data.completedSections || []);
        setCurrentSection(data.currentSection || "intro");
        setQuizScores(data.quizScores || {});
      } catch (error) {
        console.error("Failed to load progress:", error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    const data: ProgressData = {
      completedSections,
      currentSection,
      quizScores,
      lastVisited: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [completedSections, currentSection, quizScores]);

  const markSectionComplete = (sectionId: string) => {
    setCompletedSections((prev) => {
      if (prev.includes(sectionId)) return prev;
      return [...prev, sectionId];
    });
  };

  const setCurrentSectionId = (sectionId: string) => {
    setCurrentSection(sectionId);
  };

  const saveQuizScore = (quizId: string, score: number) => {
    setQuizScores((prev) => ({ ...prev, [quizId]: score }));
  };

  const resetProgress = () => {
    setCompletedSections([]);
    setCurrentSection("intro");
    setQuizScores({});
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    completedSections,
    currentSection,
    quizScores,
    markSectionComplete,
    setCurrentSectionId,
    saveQuizScore,
    resetProgress,
  };
}
