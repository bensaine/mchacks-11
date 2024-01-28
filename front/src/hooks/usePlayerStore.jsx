import { useState, useEffect } from 'react';
import { nanoid } from "nanoid";

export const usePlayerStore = () => {
    const [player, setPlayer] = useState({})

    useEffect(() => {
        let player = JSON.parse(localStorage.getItem('player'))
        if (!player || !player.id) {
            player = {
                id: nanoid(),
            }
        }

        setPlayer(player)
    }, [])

    useEffect(() => {
        localStorage.setItem('player', JSON.stringify(player))
    }, [player])
    
    const setPlayerStore = (player) => {
        setPlayer(player)
    }

    return { player, setPlayerStore }
}
