import React, { useState, useEffect } from "react";

interface Meteor {
    x: number;
    y: number;
    speed: number;
    size: number;
}

const Meteors = () => {
    const [meteorPositions, setMeteorPositions] = useState<Meteor[]>([]);
    // Generate initial meteor positions
    useEffect(() => {
        const meteors: Meteor[] = [];
        for (let i = 0; i < 12; i++) {
            meteors.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                speed: (Math.random() * 2 + 1) * 2, // Increased speed by 4 times
                // speed: 0, // Increased speed by 4 times
                size: Math.random() * 4 + 2 // Random size between 2 and 6 pixels
            });
        }
        setMeteorPositions(meteors);

        const updateMeteorPositions = () => {
            setMeteorPositions(prevPositions => {
                return prevPositions.map(meteor => {
                    // Move meteors diagonally from top-left to bottom-right
                    const newX = meteor.x + meteor.speed;
                    const newY = meteor.y + meteor.speed;
                    // Wrap around when meteors go off the screen
                    return {
                        x: newX > window.innerWidth ? 0 : newX,
                        y: newY > window.innerHeight ? 0 : newY,
                        speed: meteor.speed,
                        size: meteor.size
                    };
                });
            });
        };

        const interval = setInterval(updateMeteorPositions, 50); // Update meteor positions every 50 milliseconds

        return () => clearInterval(interval);

    }, []);

    return (
        <div className="fixed">
            {meteorPositions.map((meteor, index) => (
                <div
                    key={index}
                    className="meteor absolute"
                    style={{
                        top: `${meteor.y}px`,
                        left: `${meteor.x}px`,
                        width: `${meteor.size}px`,
                        height: `${meteor.size}px`,
                        ...({
                            '--meteor-tail-length': `${meteor.size * 15}px`
                        } as React.CSSProperties),
                    }}
                />
            ))}

        </div>
    )
}

export default Meteors