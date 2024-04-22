import React, {useContext, useEffect, useRef, useState} from "react";
import {Alert, Grow, GrowProps} from "@mui/material";
import Snackbar from '@mui/material/Snackbar';


export type FullLogSnippet = {
    severity: string,
    message: string
}

type LibmanageLogContext = {
    logs: Record<number, FullLogSnippet>
    resolveAll: () => void,
    resolveOne: (idx: number) => void,
    addInfo: (snippet: string) => void,
    addSuccess: (snippet: string) => void,
    addError: (snippet: string) => void,
}

const LibmanageLogContext = React.createContext<LibmanageLogContext>(null as any)

export const useLibmanageLog = () => useContext(LibmanageLogContext)

function GrowTransition(props: GrowProps) {
    return <Grow {...props} />;
}

const sleep = (time: number) => {
    return new Promise(resolve => setTimeout(resolve, time));
}

const SnackBarAlert: React.FC<{ snippet: FullLogSnippet, index: number }> = ({ snippet, index }) => {
    const [open, setOpen] = useState(true);
    const {resolveOne} = useLibmanageLog()

    const close = () => {
        resolveOne(index)
    }

    useEffect(() => {
        sleep(5000).then(() => close())
    }, []);

    const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
        close()
    };
    return <>
        { !open ? undefined : <div className={"w-full mb-4"}>
            <Alert onClose={handleClose} sx={({ width: '100%' })} severity={snippet.severity as any}>{snippet.message}</Alert>
        </div> }
    </>
}

export const SnackbarWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    // const [display, setDisplay] = useState({} as any)
    const {logs, resolveAll} = useLibmanageLog()
    const [serializedLogs, setSerializedLogs] = useState([] as {idx: number, snippet: FullLogSnippet}[])

    useEffect(() => {
        setSerializedLogs(Object.keys(logs).map(r => {
            const idx = Number(r)
            return {
                idx,
                snippet: logs[idx]
            }
        }).reverse())
    }, [logs]);
    useEffect(() => {
        setOpen(serializedLogs.length !== 0)
    }, [serializedLogs]);

    // useEffect(() => {
    //     addInfo({ message: "Test message" })
    // }, []);

    const handleClose = (_?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        resolveAll()
        setOpen(false);
    };
    return <>
        <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} TransitionComponent={GrowTransition} open={open} autoHideDuration={6000} onClose={handleClose}>
            <div className={"w-full flex flex-col"}>
                { serializedLogs.map((r, key) => {
                    return <SnackBarAlert key={key} snippet={r.snippet} index={r.idx} />
                }) }
            </div>
        </Snackbar>
        { children }
    </>
}

export const LibmanageLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [logs, setLogs] = useState({} as Record<number, FullLogSnippet>)
    const counterRef = useRef(0)
    const resolveAll = () => {
        setLogs({})
    }
    const resolveOne = (idx: number) => {
        setLogs(r => {
            delete r[idx]
            return r
        })
    }
    const addInfo = (snippet: string) => {
        setLogs(r => {
            const newRec = {...r}
            const idx = counterRef.current;
            counterRef.current = idx + 1
            newRec[idx] = {
                severity: 'info',
                message: snippet
            }
            return newRec
        })
    }
    const addSuccess = (snippet: string) => {
        setLogs(r => {
            const newRec = {...r}
            const idx = counterRef.current;
            counterRef.current = idx + 1
            newRec[idx] = {
                severity: 'success',
                message: snippet
            }
            return newRec
        })
    }
    const addError = (snippet: string) => {
        setLogs(r => {
            const newRec = {...r}
            const idx = counterRef.current;
            counterRef.current = idx + 1
            newRec[idx] = {
                severity: 'error',
                message: snippet
            }
            return newRec
        })
    }

    const value: LibmanageLogContext = {
        logs,
        resolveAll,
        resolveOne,
        addInfo,
        addSuccess,
        addError
    }
    return <LibmanageLogContext.Provider value={value}>
        { children }
    </LibmanageLogContext.Provider>
}
