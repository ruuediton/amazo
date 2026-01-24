import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';

const FloatingSupportButton: React.FC = () => {
    const [position, setPosition] = useState({ x: window.innerWidth - 70, y: window.innerHeight - 150 });
    const [isDragging, setIsDragging] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [links, setLinks] = useState<{ service: string, group: string } | null>(null);
    const dragRef = useRef<{ startX: number, startY: number, initialX: number, initialY: number } | null>(null);
    const buttonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const { data, error } = await supabase
                    .from('atendimento_links')
                    .select('whatsapp_gerente_url, whatsapp_grupo_vendas_url')
                    .single();

                if (data && !error) {
                    setLinks({
                        service: data.whatsapp_gerente_url,
                        group: data.whatsapp_grupo_vendas_url
                    });
                }
            } catch (err) {
                console.error("Error fetching support links", err);
            }
        };
        fetchLinks();
    }, []);

    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        // Prevent default only if needed, but here we want to allow scrolling if not grabbing? 
        // Actually for a floating button, we usually capture the touch.
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        dragRef.current = {
            startX: clientX,
            startY: clientY,
            initialX: position.x,
            initialY: position.y
        };
        setIsDragging(false); // Reset dragging state, will set to true if moved enough
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!dragRef.current) return;

        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        const deltaX = clientX - dragRef.current.startX;
        const deltaY = clientY - dragRef.current.startY;

        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            setIsDragging(true);
        }

        // Limit to screen bounds
        const newX = Math.min(Math.max(0, dragRef.current.initialX + deltaX), window.innerWidth - 60);
        const newY = Math.min(Math.max(0, dragRef.current.initialY + deltaY), window.innerHeight - 60);

        setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
        dragRef.current = null;
        // Snap to edge could go here if requested, but "qualquer area" means free floating.
    };

    const handleClick = () => {
        if (!isDragging) {
            setShowModal(true);
        }
    };

    if (!links) return null;

    return (
        <>
            {/* Draggable Button */}
            <div
                ref={buttonRef}
                style={{
                    position: 'fixed',
                    left: position.x,
                    top: position.y,
                    zIndex: 9999,
                    touchAction: 'none'
                }}
                onMouseDown={handleTouchStart}
                onTouchStart={handleTouchStart}
            // We attach move/end listeners to window in useEffect ideally, 
            // but for simple react inline events we need the element to capture.
            // Better approach for global drag is window listeners when dragging starts.
            >
                {/* We need window listeners for smooth drag if mouse leaves element */}
            </div>

            {/* Re-implementing correctly with window listeners for robustness */}
            <DraggableButton
                position={position}
                onMove={setPosition}
                onClick={handleClick}
            />

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4 animate-in fade-in duration-200">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
                    <div className="bg-white w-full max-w-xs rounded-2xl p-5 relative z-10 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg">Suporte Amazon</h3>
                            <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full">
                                <span className="material-symbols-outlined text-gray-500">close</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            <a
                                href={links.service}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-green-50 text-green-800 rounded-xl font-bold hover:bg-green-100 transition-colors"
                            >
                                <span className="material-symbols-outlined">support_agent</span>
                                Customer Service
                            </a>
                            <a
                                href={links.group}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-[#EEF5FF] text-[#2979FF] rounded-xl font-bold hover:bg-blue-100 transition-colors"
                            >
                                <span className="material-symbols-outlined">groups</span>
                                Entrar grupo de Whattsap
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const DraggableButton = ({ position, onMove, onClick }: { position: { x: number, y: number }, onMove: (pos: { x: number, y: number }) => void, onClick: () => void }) => {
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const initialPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMove = (clientX: number, clientY: number) => {
            if (!isDragging.current) return;
            const dx = clientX - dragStart.current.x;
            const dy = clientY - dragStart.current.y;

            // Check if actually moved to distinguish click vs drag
            if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
                // It's a drag
            }

            onMove({
                x: Math.min(Math.max(0, initialPos.current.x + dx), window.innerWidth - 50),
                y: Math.min(Math.max(0, initialPos.current.y + dy), window.innerHeight - 50)
            });
        };

        const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
        const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX, e.touches[0].clientY);

        const handleUp = () => {
            if (isDragging.current) {
                isDragging.current = false;
                // Clean up listeners
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleUp);
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('touchend', handleUp);
            }
        };

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, [onMove]);

    const startDrag = (clientX: number, clientY: number) => {
        isDragging.current = true;
        dragStart.current = { x: clientX, y: clientY };
        initialPos.current = { ...position };

        // Add listeners to window to track drag outside element
        window.addEventListener('mousemove', (e) => {
            if (isDragging.current) {
                const dx = e.clientX - dragStart.current.x;
                const dy = e.clientY - dragStart.current.y;
                onMove({
                    x: Math.min(Math.max(0, initialPos.current.x + dx), window.innerWidth - 50),
                    y: Math.min(Math.max(0, initialPos.current.y + dy), window.innerHeight - 50)
                });
            }
        });
        window.addEventListener('mouseup', () => { isDragging.current = false; });

        window.addEventListener('touchmove', (e) => {
            if (isDragging.current) {
                const dx = e.touches[0].clientX - dragStart.current.x;
                const dy = e.touches[0].clientY - dragStart.current.y;
                onMove({
                    x: Math.min(Math.max(0, initialPos.current.x + dx), window.innerWidth - 50),
                    y: Math.min(Math.max(0, initialPos.current.y + dy), window.innerHeight - 50)
                });
            }
        }, { passive: false });
        window.addEventListener('touchend', () => { isDragging.current = false; });
    };

    // Simplified internal handler to attach to div
    const handleDown = (e: React.MouseEvent | React.TouchEvent) => {
        // We actually rely on the click handler logic to differentiate:
        // A simple way is to track time or distance. 
        // Let's use a simpler "wasDragged" state in parent or just use a small threshold.
    };

    // Better approach: separate drag logic cleanly. 
    // Let's rely on a simpler 'react-draggable' style logic but custom.

    const [dragging, setDragging] = useState(false);

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

        dragStart.current = { x: clientX, y: clientY };
        initialPos.current = position;
        setDragging(false);

        const moveHandler = (e: Event) => {
            const cx = 'touches' in e ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
            const cy = 'touches' in e ? (e as TouchEvent).touches[0].clientY : (e as MouseEvent).clientY;

            const dx = cx - dragStart.current.x;
            const dy = cy - dragStart.current.y;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) setDragging(true);

            onMove({
                x: initialPos.current.x + dx,
                y: initialPos.current.y + dy
            });
            e.preventDefault(); // prevent scrolling
        };

        const upHandler = () => {
            window.removeEventListener('mousemove', moveHandler);
            window.removeEventListener('mouseup', upHandler);
            window.removeEventListener('touchmove', moveHandler);
            window.removeEventListener('touchend', upHandler);
        };

        window.addEventListener('mousemove', moveHandler);
        window.addEventListener('mouseup', upHandler);
        window.addEventListener('touchmove', moveHandler, { passive: false });
        window.addEventListener('touchend', upHandler);
    };

    return (
        <div
            style={{
                position: 'fixed',
                left: position.x,
                top: position.y,
                zIndex: 9999,
                touchAction: 'none',
                cursor: 'move'
            }}
            onMouseDown={handleStart}
            onTouchStart={handleStart}
            onClick={(e) => {
                if (!dragging) onClick();
            }}
            className="size-12 bg-[#25D366] rounded-full shadow-lg flex items-center justify-center text-white active:scale-90 transition-transform hover:shadow-xl hover:scale-105"
        >
            <i className="fa-brands fa-whatsapp text-2xl"></i>
            {/* Fallback icon if fontawesome not present, using material symbols but whatsapp logo is specific. 
                Material symbol 'chat' or 'call' is close. Or better, an SVG.
            */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
            </svg>
        </div>
    );
};

export default FloatingSupportButton;
