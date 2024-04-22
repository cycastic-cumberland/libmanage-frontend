import React, {useContext, useState} from "react";
import {useLibmanageAuth} from "./LibmanageAuthProvider.tsx";
import axios from "axios";
import {useLibmanageLog} from "./LibmanageLogProvider.tsx";
import {EmployeeCreationPayload} from "./LibmanageAuthContextType.ts";

type LibmanageFunctionsContextType = {
    bookRenderTrigger: number,
    memberRenderTrigger: number,
    employeeRenderTrigger: number,
    shelfRenderTrigger: number,
    createEmployeeAccount: (payload: EmployeeCreationPayload) => Promise<string>,
    getAllEmployees: () => Promise<EmployeeDetails[]>,
    searchEmployees: (pattern: string) => Promise<EmployeeDetails[]>,
    searchShelvesInfo: (pattern: string) => Promise<ShelfInfo[]>,
    deleteEmployee: (id: string) => Promise<number>,
    bookCount: () => Promise<number>,
    employeeCount: () => Promise<number>,
    memberCount: () => Promise<number>,
    getBookById: (id: number) => Promise<BookDetails | null>,
    searchBooks: (pattern: string) => Promise<BookDetails[]>,
    getAllBooks: () => Promise<BookDetails[]>,
    getAssociatedAuthors: (bookId: number) => Promise<AuthorDetails[]>,
    getAssociatedBooks: (authorName: string) => Promise<BookDetails[]>,
    createBook: (request: BookCreationRequest) => Promise<number>,
    deleteBook: (id: number) => Promise<void>,
    getBookLocations: (id: number) => Promise<ShelfDetails[]>,
    addToShelf: (bookId: number, shelfId: string) => Promise<number>,
    createShelf: (payload: ShelfDetails) => Promise<string>,
    getAllShelves: () => Promise<ShelfDetails[]>,
    getShelvesInfo: () => Promise<ShelfInfo[]>,
    getBorrowTicketById: (ticketId: number) => Promise<BorrowTicket | null>,
    borrowBook: (request: BorrowRequest) => Promise<number>,
    getBorrowTicketByBookId: (bookId: number, returned?: boolean) => Promise<BorrowTicket[]>,
    getBorrowTicketByMemberId: (memberId: string, returned?: boolean) => Promise<BorrowTicket[]>,
    getBorrowTicketByStatus: (returned: boolean) => Promise<BorrowTicket[]>,
    returnBook: (request: BookReturnRequest) => Promise<number>,
    addMember: (request: MemberDetails) => Promise<string>,
    searchMembers: (pattern: string) => Promise<MemberDetails[]>,
    deleteMember: (memberId: string) => Promise<number>,
    deleteShelf: (shelfId: string) => Promise<number>
}

const LibmanageFunctionsContext = React.createContext<LibmanageFunctionsContextType>(null as any)

const BASE_PATH = process.env.REACT_APP_LIBMANAGE_BASE_URL as string
const APPLICATION_PATH = "api/v1/"

export const useLibmanageFunctions = () => useContext(LibmanageFunctionsContext)

export type EmployeeDetails = {
    id: string,
    fullName: string,
    role: string
}

export type BookDetails = {
    id: number,
    authors: string[],
    capsuleUrl: string,
    inStorage: number,
    isbn: string,
    publishedDate: Date,
    title: string
}

export type BookCreationRequest = {
    title: string
    authors: string[],
    capsuleUrl: string,
    isbn: string,
    publishedDate: Date,
    inStorage: number,
}

export type ShelfDetails = {
    id: string,
    shelfName: string
}

export type ShelfInfo = {
    id: string,
    shelfName: string,
    bookCount: number
}

export type AuthorDetails = {
    id: number,
    authorName: string
}

export type BorrowTicket = {
    id: number,
    approvedBy: string,
    bookId: number,
    memberId: string,
    bookName: number,
    memberFullName: string,
    borrowedAt: Date,
    returned: boolean
}

export type BorrowRequest = {
    bookId: number,
    shelfId: string,
    memberId: string
}

export type BookReturnRequest = {
    shelfId: string,
    ticketId: number
}

export type MemberDetails = {
    id: string,
    fullName: string
}

export const LibmanageFunctionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bookRenderTrigger, setBookRenderTrigger] = useState(0)
    const [memberRenderTrigger, setMemberRenderTrigger] = useState(0)
    const [employeeRenderTrigger, setEmployeeRenderTrigger] = useState(0)
    const [shelfRenderTrigger, setShelfRenderTrigger] = useState(0)
    const {userSession} = useLibmanageAuth()
    const {addError} = useLibmanageLog()

    const triggerBookRerender = () => setBookRenderTrigger(r => r + 1)
    const triggerMemberRerender = () => setMemberRenderTrigger(r => r + 1)
    const triggerEmployeeRerender = () => setEmployeeRenderTrigger(r => r + 1)
    const triggerShelfRerender = () => setShelfRenderTrigger(r => r + 1)

    const sendGET = (subPath: string) => {
        return axios.get(BASE_PATH + APPLICATION_PATH + subPath, {
            headers: {
                "Authorization": `Bearer ${userSession.current.idToken ?? ""}`
            }
        })
    }

    const sendDELETE = (subPath: string) => {
        return axios.delete(BASE_PATH + APPLICATION_PATH + subPath, {
            headers: {
                "Authorization": `Bearer ${userSession.current.idToken ?? ""}`
            }
        })
    }

    const sendPOST = (subPath: string, payload?: any) => {
        return axios.post(BASE_PATH + APPLICATION_PATH + subPath, payload, {
            headers: {
                "Authorization": `Bearer ${userSession.current.idToken ?? ""}`
            }
        })
    }

    // const sendPATCH = (subPath: string, payload?: any) => {
    //     return axios.post(BASE_PATH + APPLICATION_PATH + subPath, payload, {
    //         headers: {
    //             "Authorization": `Bearer ${userSession.current.idToken ?? ""}`
    //         }
    //     })
    // }

    const sendPUT = (subPath: string, payload?: any) => {
        return axios.put(BASE_PATH + APPLICATION_PATH + subPath, payload, {
            headers: {
                "Authorization": `Bearer ${userSession.current.idToken ?? ""}`
            }
        })
    }

    const createEmployeeAccount = async (payload: EmployeeCreationPayload): Promise<string> => {
        try {
            const response = await sendPOST("employees", payload)
            triggerEmployeeRerender()
            return response.data.id as string
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return ""
    }

    const getAllEmployees = async (): Promise<EmployeeDetails[]> => {
        try {
            const response = await sendGET("employees/all")
            return response.data.employees as EmployeeDetails[]
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return []
    }

    const searchEmployees = async (pattern: string) : Promise<EmployeeDetails[]> => {
        try {
            const response = await sendGET(`employees/search?pattern=${encodeURIComponent(pattern)}`)
            return response.data.employees as EmployeeDetails[]
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return []
    }

    const searchShelvesInfo = async (pattern: string) : Promise<ShelfInfo[]> => {
        try {
            const response = await sendGET(`shelves/all/search?pattern=${encodeURIComponent(pattern)}`)
            return response.data.shelves as ShelfInfo[]
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return []
    }

    const deleteEmployee = async (id: string): Promise<number> => {
        try {
            const response = await sendDELETE(`employees?id=${encodeURIComponent(id)}`)
            triggerEmployeeRerender()
            return response.data.affected as number
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return 0
    }

    const bookCount = async () => {
        try {
            const response = await sendGET("books/count/all")
            return response.data.count as number
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return 0
    }
    const employeeCount = async () => {
        try {
            const response = await sendGET("employees/count/all")
            return response.data.count as number
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return 0
    }
    const memberCount = async () => {
        try {
            const response = await sendGET("members/count/all")
            return response.data.count as number
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return 0
    }

    const getBookById = async (id: number): Promise<BookDetails | null> => {
        try {
            const response = await sendGET(`books?id=${id}`)
            return response.data as BookDetails
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return null
    }

    const getAllBooks = async () : Promise<BookDetails[]> => {
        try {
            const response = await sendGET(`books/all`)
            return response.data.books as BookDetails[]
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return []
    }
    const searchBooks = async (pattern: string) : Promise<BookDetails[]> => {
        try {
            const response = await sendGET(`books/search?pattern=${encodeURIComponent(pattern)}`)
            return response.data.books as BookDetails[]
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return []
    }

    const getAssociatedAuthors = async (bookId: number): Promise<AuthorDetails[]> => {
        try {
            const response = await sendGET(`books/associated/authors?id=${bookId}`)
            return response.data.authors as AuthorDetails[]
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return []
    }

    const getAssociatedBooks = async (authorName: string): Promise<BookDetails[]> => {
        try {
            const response = await sendGET(`books/associated/books?author_name=${encodeURIComponent(authorName.toUpperCase())}`)
            return response.data.books as BookDetails[]
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return []
    }

    const createBook = async (request: BookCreationRequest): Promise<number> => {
        try {
            const response = await sendPUT(`books`, {
                authors: request.authors,
                capsuleUrl: request.capsuleUrl,
                inStorage: request.inStorage,
                isbn: request.isbn,
                publishedDate: request.publishedDate,
                title: request.title
            } as BookCreationRequest)
            triggerBookRerender()
            return response.data.id as number
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return 0
    }

    const deleteBook = async (id: number) => {
        try {
            await sendDELETE(`books?id=${id}`)
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
    }

    const getBookLocations = async (id: number): Promise<ShelfDetails[]> => {
        try {
            const response = await sendGET(`books/locations?id=${id}`)
            return response.data.shelves as ShelfDetails[]
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return []
    }

    const addToShelf = async (bookId: number, shelfId: string): Promise<number> => {
        try {
            const response = await sendPUT(`books/shelf?bookId=${bookId}&shelfId=${shelfId}`)
            triggerBookRerender()
            return response.data.affected as number
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return 0
    }

    const createShelf = async (payload: ShelfDetails): Promise<string> => {
        try {
            const response = await sendPUT(`shelves`, payload)
            triggerShelfRerender()
            return response.data.id as string
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return ""
    }

    const getAllShelves = async (): Promise<ShelfDetails[]> => {
        try {
            const response = await sendGET(`shelves/all`)
            return response.data.shelves as ShelfDetails[]
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return []
    }

    const getShelvesInfo = async (): Promise<ShelfInfo[]> => {
        try {
            const response = await sendGET(`shelves/all/info`)
            return response.data.shelves as ShelfInfo[]
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return []
    }

    const deleteShelf = async (shelfId: string): Promise<number> => {
        try {
            const response = await sendDELETE(`shelves?id=${encodeURIComponent(shelfId)}`)
            triggerShelfRerender()
            return response.data.affected as number
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return 0
    }

    const getBorrowTicketById = async (ticketId: number): Promise<BorrowTicket | null> => {
        try {
            const response = await sendGET(`borrows?id=${ticketId}`)
            return response.data as BorrowTicket
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return null
    }

    const borrowBook = async (request: BorrowRequest): Promise<number> => {
        try {
            const response = await sendPUT(`borrows`, request)
            triggerBookRerender()
            return response.data.id as number
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return 0
    }

    const getBorrowTicketByBookId = async (bookId: number, returned?: boolean): Promise<BorrowTicket[]> => {
        try {
            const response = await sendGET(`borrows/by-book-id?id=${bookId}${returned === null ? '' : `&returned=${returned}`}`)
            return response.data.details as BorrowTicket[]
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return []
    }

    const getBorrowTicketByMemberId = async (memberId: string, returned?: boolean): Promise<BorrowTicket[]> => {
        try {
            const response = await sendGET(`borrows/by-member-id?id=${encodeURIComponent(memberId)}${returned === null ? '' : `&returned=${returned}`}`)
            return response.data.details as BorrowTicket[]
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return []
    }

    const getBorrowTicketByStatus = async (returned: boolean): Promise<BorrowTicket[]> => {
        try {
            const response = await sendGET(`borrows/by-status?returned=${returned}`)
            return response.data.details as BorrowTicket[]
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return []
    }

    const returnBook = async (request: BookReturnRequest): Promise<number> => {
        try {
            const response = await sendPOST(`borrows/return-one`, request)
            triggerBookRerender()
            return response.data.affected as number
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return 0
    }

    const addMember = async (request: MemberDetails): Promise<string> => {
        try {
            const response = await sendPUT(`members`, request)
            triggerMemberRerender()
            return response.data.id as string
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return ""
    }

    const searchMembers = async (pattern: string): Promise<MemberDetails[]> => {
        try {
            const response = await sendGET(`members/search?pattern=${encodeURIComponent(pattern)}`)
            return response.data.members as MemberDetails[]
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return [] as MemberDetails[]
    }

    const deleteMember = async (memberId: string): Promise<number> => {
        try {
            const response = await sendDELETE(`members?id=${encodeURIComponent(memberId)}`)
            triggerMemberRerender()
            return response.data.affected as number
        } catch (e: any){
            addError(e.response.data.message ?? "Unknown error")
        }
        return 0
    }

    const value: LibmanageFunctionsContextType = {
        bookRenderTrigger,
        memberRenderTrigger,
        employeeRenderTrigger,
        shelfRenderTrigger,
        createEmployeeAccount,
        getAllEmployees,
        searchEmployees,
        searchShelvesInfo,
        deleteEmployee,
        bookCount,
        employeeCount,
        memberCount,
        getBookById,
        getAllBooks,
        searchBooks,
        getAssociatedAuthors,
        getAssociatedBooks,
        createBook,
        deleteBook,
        getBookLocations,
        addToShelf,
        createShelf,
        getAllShelves,
        getShelvesInfo,
        getBorrowTicketById,
        borrowBook,
        getBorrowTicketByBookId,
        getBorrowTicketByMemberId,
        getBorrowTicketByStatus,
        returnBook,
        addMember,
        searchMembers,
        deleteMember,
        deleteShelf,
    }
    return <LibmanageFunctionsContext.Provider value={value}>
        { children }
    </LibmanageFunctionsContext.Provider>
}
