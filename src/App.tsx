import { useEffect, useState } from 'react';

const mocaWords = [
    'apple', 'banana', 'table', 'chair', 'spoon', 'pencil', 'book', 'door', 'phone', 'wallet',
    'hand', 'foot', 'heart', 'nose', 'brain', 'doctor', 'nurse', 'hospital', 'pill', 'sleep',
    'mother', 'father', 'bed', 'kitchen', 'light', 'couch', 'window', 'key', 'baby', 'house',
    'tree', 'flower', 'cloud', 'river', 'mountain', 'dog', 'cat', 'bird', 'fish', 'horse',
    'car', 'bus', 'train', 'road', 'bridge', 'city', 'park', 'beach', 'plane', 'hotel',
    'clock', 'minute', 'hour', 'day', 'night', 'number', 'one', 'two', 'three', 'seven',
    'circle', 'square', 'triangle', 'red', 'blue', 'green', 'white', 'black', 'yellow', 'orange',
    'run', 'jump', 'sleep', 'eat', 'drink', 'write', 'read', 'speak', 'walk', 'laugh',
    'happy', 'sad', 'angry', 'tired', 'cold', 'hot', 'hungry', 'scared', 'bored', 'calm',
    'money', 'music', 'water', 'fire', 'love', 'noise', 'game', 'school', 'work', 'time'
];

function getRandomWords(count = 5) {
    return [...mocaWords].sort(() => 0.5 - Math.random()).slice(0, count);
}

export default function App() {
    const [words, setWords] = useState<string[]>([]);
    const [phase, setPhase] = useState<'idle' | 'showing' | 'hidden' | 'recall' | 'submitted'>('idle');    const [displayCountdown, setDisplayCountdown] = useState(0);
    const [recallMinutes, setRecallMinutes] = useState(1);
    const [showInput, setShowInput] = useState(false);
    const [userInput, setUserInput] = useState('');

    const [displayDuration, setDisplayDuration] = useState(10); // seconds

    function startNewRound() {
        const newWords = getRandomWords();
        setWords(newWords);
        setPhase('showing');
        setDisplayCountdown(displayDuration);
        setShowInput(false);
        setUserInput('');
    }

// Countdown logic
    useEffect(() => {
        if (phase === 'showing' && displayCountdown > 0) {
            const interval = setInterval(() => {
                setDisplayCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }

        if (phase === 'showing' && displayCountdown === 0) {
            setPhase('hidden');
        }
    }, [phase, displayCountdown]);

// Recall delay logic (start when we enter the hidden phase)
    useEffect(() => {
        if (phase === 'hidden') {
            const timeout = setTimeout(() => {
                setShowInput(true);
                setPhase('recall');
            }, recallMinutes * 60 * 1000);

            return () => clearTimeout(timeout); // ✅ clean up if phase changes before timeout
        }
    }, [phase, recallMinutes]);
    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h1>Random Word Recall</h1>
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={startNewRound}>Get New Words</button>
                <button
                    onClick={() => {
                        const newVal = prompt('Set hide time in seconds:', displayDuration.toString());
                        if (newVal) setDisplayDuration(parseInt(newVal));
                    }}
                >
                    Hide in: {displayDuration}s
                </button>
                <button
                    onClick={() => {
                        const newVal = prompt('Set recall delay in minutes (1–60):', recallMinutes.toString());
                        if (newVal) setRecallMinutes(parseInt(newVal));
                    }}
                >
                    Recall in: {recallMinutes}m
                </button>
            </div>

            {phase === 'showing' && (
                <>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{words.join('  ')}</div>
                    <p>Words will be hidden in {displayCountdown} second{displayCountdown !== 1 ? 's' : ''}...</p>
                </>
            )}

            {phase === 'hidden' && (
                <p>Recall input will appear in {recallMinutes} minute{recallMinutes !== 1 ? 's' : ''}...</p>
            )}

            {showInput && (
                <div>
                    <p>Please enter the words you remember (space-separated):</p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    setPhase('submitted');
                                }
                            }}
                            style={{ flex: 1, padding: '0.5rem', fontSize: '1.25rem' }}
                        />
                        <button onClick={() => setPhase('submitted')}>Submit Answer</button>
                    </div>

                    {phase === 'submitted' && (
                        <div style={{ marginTop: '1rem' }}>
                            <p><strong>Original words were:</strong></p>
                            <p>{words.join('  ')}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
