import React, { useState, useEffect, useRef } from 'react';
import { GameLayout } from './components/GameLayout';
import { GameResponse } from './types';
// 1. IMPORT DIPERBARUI: Memanggil fungsi baru dari gameService
import { initGameSession, sendPlayerAction } from './services/gameService';

export default function App() {
  const [gameData, setGameData] = useState<GameResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitial, setIsInitial] = useState(true);
  
  // Store the chat instance
  const chatRef = useRef<any>(null);

  useEffect(() => {
    // Initialize game
    const initGame = async () => {
      setIsLoading(true);
      try {
        // 2. INISIALISASI DIPERBARUI: Menggunakan initGameSession()
        chatRef.current = initGameSession();
        
        // 3. PENGIRIMAN PESAN DIPERBARUI: Menggunakan sendPlayerAction()
        const data = await sendPlayerAction(chatRef.current, "Mulai permainan baru.");
        
        setGameData(data);
        setIsInitial(data.options.length === 0);
      } catch (error) {
        console.error("Failed to initialize game:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initGame();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!chatRef.current) return;

    setIsLoading(true);

    try {
      // 4. PENGIRIMAN PESAN DIPERBARUI: Menggunakan sendPlayerAction()
      const data = await sendPlayerAction(chatRef.current, text);
      
      setGameData(data);
      setIsInitial(data.options.length === 0);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GameLayout 
      gameData={gameData} 
      isLoading={isLoading} 
      onSendMessage={handleSendMessage} 
      isInitial={isInitial}
    />
  );
}