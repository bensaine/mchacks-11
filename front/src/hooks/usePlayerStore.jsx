import { useState, useEffect } from 'react';
import { nanoid } from "nanoid";

export const usePlayerStore = () => {
    const makeDefault = () => {
        let storedPlayer = JSON.parse(localStorage.getItem('player'))
        if (!storedPlayer || !storedPlayer.id) {
            storedPlayer = {
                id: nanoid(),
            }
        }
        return storedPlayer
    }
    const [player, setPlayer] = useState(makeDefault())

    // useEffect(() => {
    //     let storedPlayer = JSON.parse(localStorage.getItem('player'))
    //     if (!storedPlayer || !storedPlayer.id) {
    //         storedPlayer = {
    //             id: nanoid(),
    //         }
    //     }

    //     setPlayer(prev => storedPlayer)
    // }, [])

    useEffect(() => {
        // alert(`setting localstorage to ${JSON.stringify(player)}`)
        localStorage.setItem('player', JSON.stringify(player))
    }, [player])
    
    const setPlayerStore = (player) => {
        // localStorage.setItem('player', JSON.stringify(player))
        setPlayer(player)
    }

    const getStoragePlayer = () => {
        return JSON.parse(localStorage.getItem('player'))
    }

    return { player, setPlayerStore, getStoragePlayer}
}
