
import { State, useStore } from "../utils/store"
import { Only } from "../utils/utils"

export default function Ui() {
    let state = useStore(i => i.state)
    let score = useStore(i => i.stack.height)

    return (
        <>
            <h1 className="visually-hidden">Stacky</h1>
            <p className="visually-hidden">A JavaScript Stack clone made with React + Three.</p>

            <Only if={state !== State.IDLE && score > 0}>
                <div className="panel panel--score">
                    <span className="visually-hidden">Score: </span>{score}
                </div>
            </Only>

            <Only if={state === State.GAME_OVER}>
                <div className="panel panel--game-over">
                    Game over
                </div>
                <div className="panel__subtitle">Tap to restart</div>
            </Only>
            <Only if={state === State.IDLE}>
                <div className="panel panel--intro logo"> 
                    <svg viewBox="0 0 268 94" fill="currentColor" aria-label="Stacky game">
                        <path d="M1.1 71c1.29-2.28 2.6-3.42 3.95-3.42.43 0 1.01.25 1.75.74A24.26 24.26 0 0 0 17.82 71c5.33 0 9.52-1.34 12.59-4.02C33.47 64.3 35 60.36 35 55.16s-1.68-8.98-5.05-11.32a30.66 30.66 0 0 0-5.24-2.81 69.75 69.75 0 0 0-9-2.73 23.12 23.12 0 0 1-3.4-1.06c-.37-.15-.83-.37-1.38-.65a4.7 4.7 0 0 1-1.2-.78c-.24-.25-.57-.63-1-1.16a3.33 3.33 0 0 1-.65-2.17c0-1.54.7-2.82 2.12-3.83 1.4-1.02 3.55-1.53 6.43-1.53 6.55 0 11.39 4 14.51 12.01h1.1V25h-1a10.65 10.65 0 0 1-1.57 2.4c-.43.43-.95.65-1.56.65a7.6 7.6 0 0 1-2.66-.74 22.76 22.76 0 0 0-9.28-2.13c-4.9 0-8.82 1.44-11.76 4.3C1.47 32.34 0 36.18 0 40.98s1.68 8.31 5.05 10.53a35.84 35.84 0 0 0 10.47 4.43c3.74.74 6.8 1.79 9.2 3.14A4.19 4.19 0 0 1 27 62.96c0 4-3.13 6-9.37 6-4.04 0-7.41-1.07-10.1-3.23-2.7-2.15-4.85-5.9-6.44-11.26H0V71h1.1Z" />
                        <path d="M57.92 71c5.12 0 8.79-1.25 11-3.74 2.23-2.49 3.59-5.86 4.08-10.1l-1.57-.19c-.44 3.2-1.35 5.72-2.73 7.57-1.4 1.85-3.01 2.77-4.86 2.77-1.85 0-3.07-.68-3.66-2.03-.58-1.36-.88-3.48-.88-6.37v-31.1h12.03v-1.66H59.3V10l-17.2 4.25v11.9H37v1.66h5.09v29.07c0 5.35 1.36 9.04 4.07 11.07C48.88 69.98 52.8 71 57.92 71Z" />
                        <path d="M96.77 25c7.35 0 12.43 1.25 15.23 3.76 2.81 2.5 4.22 7.1 4.22 13.77v19.12c.06 3.02.95 4.53 2.69 4.53 2.1 0 3.33-3.19 3.7-9.56l1.39.1-.02.49c-.29 5.17-1.3 8.75-3.04 10.73-1.79 2.04-4.72 3.06-8.8 3.06-7.4 0-11.67-2.29-12.78-6.86-.8 2.35-2 4.08-3.61 5.2-1.6 1.1-3.95 1.66-7.04 1.66C79.57 71 75 67.26 75 59.78c0-4.4 1.74-7.4 5.23-9.04 3.5-1.64 8.85-2.46 16.07-2.46H99v-7.14l-.01-.53c-.02-5.58-.34-9.35-.97-11.3-.65-2-1.9-3.01-3.75-3.01-1.11 0-2.12.3-3.01.88-.9.59-1.35 1.4-1.35 2.41 0 1.02.19 2.06.56 3.1h2.31l.12.34c.42 1.23.63 2.68.63 4.35 0 1.82-.78 3.4-2.32 4.73a8.63 8.63 0 0 1-5.84 2c-5.3 0-7.96-2.57-7.96-7.7C77.4 28.8 83.86 25 96.77 25ZM99 50h-.83c-3.45.12-5.17 3-5.17 8.67v1.91c.01 3.08.17 5.08.48 6 .32.94.93 1.42 1.82 1.42.9 0 1.74-.81 2.53-2.43.78-1.62 1.17-3.86 1.17-6.71V50Z" />
                        <path d="M148.25 71c5.63 0 10.05-1.2 13.26-3.62 3.15-2.35 5.32-6.18 6.49-11.5l-1.67-.18c-.62 3.15-2 5.96-4.17 8.44-2.16 2.47-5.07 3.7-8.72 3.7-3.64 0-6.15-1.32-7.5-3.98-1.37-2.66-2.05-7.05-2.05-13.17v-4.82c0-6.87.6-11.78 1.77-14.75 1.17-2.97 3.12-4.45 5.84-4.45 2.96 0 4.45 1.48 4.45 4.45 0 .99-.22 2.1-.65 3.34h-3.06a12.41 12.41 0 0 0-.47 3.34c0 2.53.75 4.45 2.23 5.75 1.48 1.3 3.45 1.95 5.89 1.95 2.44 0 4.36-.75 5.75-2.23 1.39-1.48 2.08-3.83 2.08-7.05 0-3.21-1.45-5.89-4.36-8.02-2.9-2.13-7.1-3.2-12.6-3.2-7.8 0-13.87 2-18.22 6.03-4.36 4.02-6.54 9.75-6.54 17.2 0 7.45 1.92 13.1 5.75 16.97 3.83 3.87 9.33 5.8 16.5 5.8Z" />
                        <path d="M195.24 70v-1.68h-4.31V47.13l1.78-.46 10.58 21.65h-4.31V70H225v-1.68h-3.37l-16.19-31.64 11.14-9.43h6.55v-1.68h-18.44v1.68h8.8l-21.06 17.46-1.5.56V0H168v1.68h5.52v66.64h-5.15V70z" />
                        <path d="M229.8 94c3.66 0 6.76-1.17 9.3-3.51 2.54-2.34 4.83-6.45 6.87-12.32l17.38-50.48H268V26h-13.1v1.69h6.22l-10.78 31.1-10.13-31.1h5.02V26h-26.95v1.69h3.8l15.9 42.9h8.18l-2.04 5.8c-1.8 5.18-3.7 9.04-5.67 11.57-1.99 2.53-4.25 3.8-6.79 3.8-1.3 0-2.14-.48-2.5-1.41-.38-.94-.32-2.13.18-3.56h3.25c.37-1.31.56-2.44.56-3.37 0-4.31-2.57-6.47-7.72-6.47-2.23 0-4.02.69-5.39 2.06-1.36 1.38-2.04 3.38-2.04 6a7.92 7.92 0 0 0 3.16 6.46c2.1 1.69 4.99 2.53 8.64 2.53Z" />
                    </svg> 
                </div>
                <div className="panel__subtitle">Tap to start</div>
            </Only>
        </>
    )
}