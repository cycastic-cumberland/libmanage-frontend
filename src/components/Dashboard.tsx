import SideBar from "./SideBar.tsx";
import {BasicDatePicker, MiniInnerPanel, MiniPanel} from "./BasicComponents.tsx";
import Translations from "../I18N.ts";
import { IoMdAddCircle } from "react-icons/io";
import {
    BookDetails, BorrowTicket,
    MemberDetails,
    ShelfDetails,
    useLibmanageFunctions
} from "../contexts/LibmanageFunctionsProvider.tsx";
import React, {useEffect, useRef, useState} from "react";
import {useLibmanageAuth} from "../contexts/LibmanageAuthProvider.tsx";
import {BigShinyButton, ConfirmationBox, FullWidthButton} from "./BigShinyButton.tsx";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {TextField} from "@mui/material";
import { FaBookmark } from "react-icons/fa";
import {useLibmanageLog} from "../contexts/LibmanageLogProvider.tsx";
import dayjs, {Dayjs} from "dayjs";
import {MdAssignmentReturned, TiDelete} from "react-icons/all";

const CountCard: React.FC<{ name: string, value: number }> = ({ name, value }) => {
    return <MiniPanel>
        <div className={"w-full flex flex-row"}>
            <div className={"mr-2 w-full"}>
                <div className="mb-2 items-start text-align-left text-xl font-bold tracking-tight text-gray-300">
                    { name }
                </div>
            </div>
            <div className={"ml-2 w-full"}>
                <input readOnly={true} value={value} className={"w-full block rounded-lg bg-chatbox py-2 px-4"}/>
            </div>
        </div>
    </MiniPanel>
}

const TotalBooks = () => {
    const [count, setCount] = useState(0)
    const {bookCount, bookRenderTrigger} = useLibmanageFunctions()

    useEffect(() => {
        bookCount().then(r => setCount(r))
    }, [bookRenderTrigger]);

    return <CountCard name={Translations.dashboardBookCount} value={count} />
}

const TotalEmployees = () => {
    const [count, setCount] = useState(0)
    const {employeeCount} = useLibmanageFunctions()

    useEffect(() => {
        employeeCount().then(r => setCount(r))
    }, []);

    return <CountCard name={Translations.dashboardEmployeeCount} value={count} />
}

const TotalMembers = () => {
    const [count, setCount] = useState(0)
    const {memberCount, memberRenderTrigger} = useLibmanageFunctions()

    useEffect(() => {
        memberCount().then(r => setCount(r))
    }, [memberRenderTrigger]);

    return <CountCard name={Translations.dashboardMemberCount} value={count} />
}

const RoleDisplay = () => {
    const {userSession} = useLibmanageAuth()

    return <MiniPanel>
        <div className={"w-full flex flex-row"}>
            <div className={"mr-2 w-full"}>
                <div className="mb-2 items-start text-align-left text-xl font-bold tracking-tight text-gray-300">
                    { Translations.dashboardRoleDisplay }
                </div>
            </div>
            <div className={"ml-2 w-full"}>
                <input readOnly={true} value={userSession.current.role} className={"w-full block rounded-lg bg-chatbox py-2 px-4"}/>
            </div>
        </div>
    </MiniPanel>
}

const HelloBar = () => {
    const {userSession} = useLibmanageAuth()
    return <div className={"w-full flex flex-row mt-10 mb-5 ml-5"}>
        <div className={"mr-2 w-full"}>
            <div className="mb-2 items-start text-align-left text-xl font-bold tracking-tight text-gray-300">
                { `${Translations.dashboardHello} ${userSession.current.fullName}` }
            </div>
        </div>
    </div>
}

const BookCapsule: React.FC<{ book: BookDetails }> = ({ book }) => {
    const [showBorrow, setShowBorrow] = useState(false)
    const [showAddShelf, setShowAddShelf] = useState(false)
    const [locations, setLocations] = useState([] as ShelfDetails[])
    const [selectedShelf, setSelectedShelf] = useState('')
    const { bookRenderTrigger, shelfRenderTrigger, getBookLocations, borrowBook, addToShelf, getAllShelves } = useLibmanageFunctions()
    const { addError, addSuccess } = useLibmanageLog()
    const memberIdBox = useRef(null as any as HTMLInputElement)
    const [submittingShelf, setSubmittingShelf] = useState('')
    const [shelves, setShelves] = useState([] as ShelfDetails[])
    const dummyRef = useRef<HTMLDivElement>(null);

    const scrollIntoView = () => {
        dummyRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }

    useEffect(() => {
        getBookLocations(book.id).then(r => {
            const rec: Record<string, { name: string, count: number }> = {}
            for (let i = 0; i < r.length; i++){
                const cell = r[i];
                if (cell.id in rec){
                    const { name, count } = rec[cell.id]
                    rec[cell.id] = { name, count: count + 1 }
                } else {
                    rec[cell.id] = { name: cell.shelfName, count: 1 }
                }
            }
            const newLocations = Object.keys(rec).map(r => { return { id: r, shelfName: `${rec[r].name}${rec[r].count == 1 ? '': ` (x${rec[r].count})`}` } })
            setLocations(newLocations)
        })
    }, [bookRenderTrigger]);

    useEffect(() => {
        getAllShelves().then(r => setShelves(r))
    }, [shelfRenderTrigger]);

    const onBorrow = async () => {
        if (!memberIdBox.current.value) {
            addError(Translations.dlgBorrowNoMemberId)
            return
        }
        if (!selectedShelf){
            addError(Translations.dlgBorrowNoShelfId)
            return
        }
        const ret = await borrowBook({
            bookId: book.id,
            shelfId: selectedShelf,
            memberId: memberIdBox.current.value
        })
        if (ret > 0) addSuccess(Translations.dglBorrowSuccess)
    }

    const onAddShelf = async () => {
        if (!submittingShelf){
            addError(Translations.dlgAddShelfNoShelfId)
            return
        }
        const ret = await addToShelf(book.id, submittingShelf)
        if (ret > 0) addSuccess(Translations.dlgAddShelfSuccess)
    }

    return <MiniInnerPanel>
        <div ref={dummyRef}/>
        <div className={"w-full flex flex-row"}>
            <div className={"flex flex-col mr-5 mt-3 mb-3"}>
                <img src={ book.capsuleUrl } className={"max-h-80"} alt={"Shitfuck"} />
            </div>
            <div className={"w-full flex flex-col ml-20"}>
                <p className={"text-2xl font-bold tracking-tight text-gray-300"}>
                    { book.title }
                </p>
                {/*<br />*/}
                <div className={"w-full flex flex-row mt-5"}>
                    <div className={"min-w-fit text-xl font-bold tracking-tight text-gray-300 mb-2 mr-8"}>
                        { Translations.dashboardShelfAuthor }:
                    </div>
                    <div className={"w-full flex flex-col"}>
                        { book.authors.map((r, k) =>{
                            return <p key={k} className={"text-xl tracking-tight text-gray-300"}>
                                { r }
                            </p>
                        }) }
                    </div>
                </div>
                <div>
                    <span className={"text-xl tracking-tight text-gray-300 mt-5 mr-5 font-bold"}>
                        ISBN:
                    </span>
                    <span className={"text-xl tracking-tight text-gray-300 mt-5"}>
                        { book.isbn }
                    </span>
                </div>
                <div>
                    <span className={"text-xl tracking-tight text-gray-300 mt-5 mr-5 font-bold"}>
                        { Translations.dashboardShelfInStorage }:
                    </span>
                    <span className={"text-xl tracking-tight text-gray-300 mt-5"}>
                        { book.inStorage }
                    </span>
                </div>
                <div className={"mt-3"}>
                    <FullWidthButton
                        text={(showBorrow ? Translations.dlgHide : Translations.dlgBorrowTitle)}
                        icon={(showBorrow ? undefined : <FaBookmark className="text-gray-200" />)}
                        onClick={()=>{
                            if (!showBorrow) scrollIntoView()
                            setShowBorrow(r => !r)
                        }} />
                </div>
                { !showBorrow ? undefined :
                    <div className={"w-full mt-3 mb-3"}>
                        <TextField inputRef={memberIdBox} className={"w-full mt-2"} margin={"dense"} id="outlined-basic" label={Translations.dlgBorrowMemberField} variant="outlined" />
                        <FormControl className={"w-full mt-2 mb-2"} margin={"dense"}>
                            <InputLabel id="demo-simple-select-label">{Translations.dlgBorrowShelfField}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedShelf}
                                label={Translations.dlgBorrowShelfField}
                                onChange={(e) => { setSelectedShelf(e.target.value)}}
                            >
                                { locations.map((r, k) => {
                                    return <MenuItem key={k} value={r.id}>{ r.shelfName }</MenuItem>
                                }) }
                            </Select>
                        </FormControl>
                        <FullWidthButton
                            text={Translations.dlgBorrowBtn}
                            icon={<FaBookmark className="text-gray-200" />}
                            onClick={onBorrow} />
                    </div> }
                <div className={"mt-3"}>
                    <FullWidthButton
                        text={(showAddShelf ? Translations.dlgHide : Translations.dlgAddShelfTitle)}
                        icon={(showAddShelf ? undefined : <IoMdAddCircle className="text-gray-200" />)}
                        onClick={()=>{
                            if (!showAddShelf) scrollIntoView()
                            setShowAddShelf(r => !r)
                        }} />
                </div>
                { !showAddShelf ? undefined :
                    <div className={"w-full mt-3 mb-3"}>
                        <FormControl className={"w-full mt-2 mb-2"} margin={"dense"}>
                            <InputLabel id="demo-simple-select-label">{Translations.dlgBAddShelfShelfField}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={submittingShelf}
                                label="Age"
                                onChange={(e) => {
                                    setSubmittingShelf(e.target.value)
                                }}
                            >
                                { shelves.map((r, k) => {
                                    return <MenuItem key={k} value={r.id}>{ r.shelfName }</MenuItem>
                                }) }
                            </Select>
                        </FormControl>
                        <FullWidthButton
                            text={Translations.dlgAddShelfBtn}
                            icon={<IoMdAddCircle className="text-gray-200" />}
                            onClick={onAddShelf} />
                    </div> }
            </div>
        </div>
    </MiniInnerPanel>
}

const CreateBookPanel = () => {
    const { createBook } = useLibmanageFunctions()
    const titleBox = useRef(null as any as HTMLInputElement)
    const authorsBox = useRef(null as any as HTMLInputElement)
    const capsuleBox = useRef(null as any as HTMLInputElement)
    const isbnBox = useRef(null as any as HTMLInputElement)
    const [publishedDate, setPublishedDate] = useState(dayjs())
    const { addError, addSuccess } = useLibmanageLog()
    const [loading, setIsLoading] = useState(false)

    const onAdd = () => {
        setIsLoading(isLoading => {
            if (isLoading) return true;
            if (!titleBox.current.value) {
                addError(Translations.dlgAddBookNoTitle)
                return false
            }
            if (!authorsBox.current.value) {
                addError(Translations.dlgAddBookNoAuthors)
                return false
            }
            if (!capsuleBox.current.value) {
                addError(Translations.dlgAddBookNoCapsule)
                return false
            }
            if (!isbnBox.current.value) {
                addError(Translations.dlgAddBookNoISBN)
                return false
            }
            createBook({
                title: titleBox.current.value.trim(),
                authors: authorsBox.current.value.split(';').map(r => r.trim()),
                capsuleUrl: capsuleBox.current.value.trim(),
                isbn: isbnBox.current.value.trim(),
                publishedDate: publishedDate.toDate(),
                inStorage: 0
            }).then(r => {
                setIsLoading(false)
                if (r > 0) addSuccess(Translations.dlgAddBookSuccess)
            })
            return true;
        })
    }

    return <MiniInnerPanel panelName={Translations.dlgAddBookTitle}>
        <TextField disabled={loading} inputRef={titleBox} className={"w-full mt-2"} margin={"dense"} id="outlined-basic" label={Translations.dlgAddBookTitleField} variant="outlined" />
        <TextField disabled={loading} inputRef={authorsBox} className={"w-full mt-2"} margin={"dense"} id="outlined-basic" label={Translations.dlgAddBookAuthorsField} variant="outlined" />
        <TextField disabled={loading} inputRef={capsuleBox} className={"w-full mt-2"} margin={"dense"} id="outlined-basic" label={Translations.dlgAddBookCapsuleField} variant="outlined" />
        <TextField disabled={loading} type={"text"} inputProps={{
            inputMode: 'numeric',
            pattern: '/^-?\d+(?:\.\d+)?$/g'
        }}  inputRef={isbnBox} className={"w-full mt-2"} margin={"dense"} id="outlined-basic" label={Translations.dlgAddBookIsbnField} variant="outlined" />
        <BasicDatePicker readOnly={loading} label={Translations.dlgAddBookPublishedDateField} value={publishedDate} onChange={(date: Dayjs) => setPublishedDate(date)}/>
        <FullWidthButton
            text={Translations.dlgAddBookBtn}
            icon={<IoMdAddCircle size={20} className="text-gray-200" />}
            onClick={onAdd} />
    </MiniInnerPanel>
}

const BookShelf = () => {
    const [books, setBooks] = useState([] as BookDetails[])
    const searchBox = useRef(null as any as HTMLInputElement)
    const { bookRenderTrigger, getAllBooks, searchBooks } = useLibmanageFunctions()
    const { userSession } = useLibmanageAuth()
    const [searchTrigger, setSearchTrigger] = useState(0)
    const [_, setIsFetching] = useState(false)
    const [showAddBook, setShowAddBook] = useState(false);
    const dummyRef = useRef<HTMLDivElement>(null);
    const searchTriggerFatigue = 100
    const booksReceivedHandle = (r: BookDetails[]) => {
        setBooks(r.sort((a, b) => a.title.localeCompare(b.title)))
        setIsFetching(false)
    }

    useEffect(() => {
        setIsFetching(r => {
            if (!r) {
                if (searchBox.current.value) searchBooks(searchBox.current.value).then(booksReceivedHandle)
                else getAllBooks().then(booksReceivedHandle);
            }
            return true
        })
    }, [bookRenderTrigger, searchTrigger]);

    const handleSubmit: React.KeyboardEventHandler<HTMLInputElement> = async (_) => {
        const curr = new Date().valueOf()
        if (searchTrigger < curr - searchTriggerFatigue)
            setSearchTrigger(curr)
    };

    const scrollIntoView = () => {
        dummyRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }

    return <div className={"w-full flex flex-row"}>
        <MiniPanel>
            <div className={"mr-2 flex flex-row"}>
                <div className="min-w-fit mb-2 mt-5 items-start text-align-left text-xl font-bold tracking-tight text-gray-300">
                    { Translations.dashboardShelfTitle }
                </div>
                <div className={"w-full flex ml-5 text-gray-200"}>
                    <TextField onKeyDown={handleSubmit} inputRef={searchBox} className={"w-full mt-2"} margin={"dense"} id="outlined-basic" label={Translations.dashboardSearchTitle} variant="outlined" />
                </div>
                { userSession.current.role !== "SUPERUSER" ? undefined :
                    <div className={"min-w-fit flex ml-5"}>
                        <BigShinyButton
                            text={(showAddBook ? Translations.dlgHide : Translations.dashboardAddTitle)}
                            icon={(showAddBook ? undefined : <IoMdAddCircle size={25} className="text-gray-200" />)}
                            onClick={() => {
                                if (!showAddBook) scrollIntoView()
                                setShowAddBook(r => !r)
                            }} />
                    </div>
                }
            </div>
            <div className={"max-w-full max-h-screen flex flex-col overflow-y-auto pb-10"}>
                <div ref={dummyRef}/>
                { !showAddBook ? undefined : <CreateBookPanel /> }
                { books.map((r, k) => <BookCapsule key={k} book={r} /> ) }
            </div>
        </MiniPanel>
    </div>
}

const AddMemberPanel = () => {
    const idBox = useRef(null as any as HTMLInputElement)
    const nameBox = useRef(null as any as HTMLInputElement)
    const [loading, setLoading] = useState(false)
    const { addMember } = useLibmanageFunctions()
    const { addError, addSuccess } = useLibmanageLog()

    const onAdd = () => {
        setLoading(r => {
            if (r) return r;
            if (!idBox.current.value) {
                addError(Translations.dlgAddMemberNoID)
                return false
            }
            if (!nameBox.current.value) {
                addError(Translations.dlgAddMemberNoName)
                return false
            }
            addMember({ id: idBox.current.value, fullName: nameBox.current.value }).then(r => {
                setLoading(false)
                if (r) addSuccess(Translations.dlgAddMemberSuccess)
            })
            return true;
        })
    }

    return <MiniInnerPanel panelName={Translations.dlgAddMemberTitle}>
        <TextField disabled={loading} inputRef={idBox} className={"w-full mt-2"} margin={"dense"} id="outlined-basic" label={Translations.dlgAddMemberIdField} variant="outlined" />
        <TextField disabled={loading} inputRef={nameBox} className={"w-full mt-2"} margin={"dense"} id="outlined-basic" label={Translations.dlgAddMemberNameField} variant="outlined" />
        <FullWidthButton
            text={Translations.dlgAddMemberBtn}
            icon={<IoMdAddCircle size={20} className="text-gray-200" />}
            onClick={onAdd} />
    </MiniInnerPanel>
}

const MemberCard: React.FC<{ member: MemberDetails }> = ({ member }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const { deleteMember } = useLibmanageFunctions()
    const { addSuccess } = useLibmanageLog()

    const onSubmit = () => {
        setShowDeleteConfirm(false)
        setLoading(l => {
            if (l) return l
            deleteMember(member.id).then(r => {
                setLoading(false)
                if (r > 0) addSuccess(Translations.dlgDeleteMemberSuccess)
            })
            return true
        })
    }

    const onCancel = () => {
        setShowDeleteConfirm(false)
    }

    return <MiniPanel>
        <div className={"w-full flex flex-row"}>
            <div className={"w-full flex mr-2 mt-4"}>
                <p className={"text-2xl font-bold tracking-tight text-gray-300"}>
                    { member.id }
                </p>
            </div>
            <div className={"w-full flex mr-2 mt-6"}>
                <p className={"tracking-tight text-gray-300"}>
                    { member.fullName }
                </p>
            </div>
            <div className={"w-full flex mb-4"}>
                <FullWidthButton
                    text={Translations.dlgDeleteMember}
                    icon={<TiDelete size={20} className="text-gray-200" />}
                    onClick={() => setShowDeleteConfirm(!loading)} />
            </div>
            { !showDeleteConfirm ? undefined :
                <ConfirmationBox header={Translations.dlgDeleteMember} onSubmit={onSubmit} onClose={onCancel}>
                    <div className={"min-w-fit mb-5 mx-5"}>
                        { Translations.dlgDeleteMemberConfirmation }
                    </div>
                </ConfirmationBox>
            }
        </div>
    </MiniPanel>
}

const MemberSearch = () => {
    const [searchTrigger, setSearchTrigger] = useState(0)
    const searchBox = useRef(null as any as HTMLInputElement)
    const [members, setMembers] = useState([] as MemberDetails[])
    const { searchMembers, memberRenderTrigger } = useLibmanageFunctions()
    const [_, setIsFetching] = useState(false)
    const searchTriggerFatigue = 100

    useEffect(() => {
        setIsFetching(isFetching => {
            if (isFetching) return isFetching;
            if (!searchBox.current.value){
                setMembers([])
                return false;
            }
            searchMembers(searchBox.current.value).then(r => {
                setIsFetching(false)
                setMembers(r)
            })
            return true;
        })
    }, [searchTrigger, memberRenderTrigger]);

    const handleSubmit: React.KeyboardEventHandler<HTMLInputElement> = async (_) => {
        const curr = new Date().valueOf()
        if (searchTrigger < curr - searchTriggerFatigue)
            setSearchTrigger(curr)
    };

    return <MiniInnerPanel>
        <div className={"w-full flex flex-col"}>
            <div className={"w-full flex flex-row"}>
                <div className="min-w-fit mb-2 mt-5 mr-5 items-start text-align-left text-xl font-bold tracking-tight text-gray-300">
                    { Translations.dashboardMemberSearchTitle }
                </div>
                <div className={"w-full flex mb-2"}>
                    <TextField onKeyDown={handleSubmit} inputRef={searchBox} className={"w-full mt-2"} margin={"dense"} id="outlined-basic" label={Translations.dashboardSearchTitle} variant="outlined" />
                </div>
            </div>
            { members.map((r, k) => {
                return <MemberCard key={k} member={r} />
            }) }
        </div>
    </MiniInnerPanel>
}

const BorrowDetailsCard: React.FC<{ borrow: BorrowTicket, shelves: ShelfDetails[] }> = ({ borrow, shelves }) => {
    const [showReturn, setShowReturn] = useState(false)
    const [selectedShelf, setSelectedShelf] = useState('')
    const [_, setLoading] = useState(false)
    const { returnBook } = useLibmanageFunctions()
    const { addError, addSuccess } = useLibmanageLog()

    const onReturn = () => {
        setLoading(loading => {
            if (loading) return loading;
            if (!selectedShelf){
                addError(Translations.dlgBorrowReturnNoShelfId)
                return false
            }
            returnBook({ ticketId: borrow.id, shelfId: selectedShelf }).then(r => {
                if (r > 0) addSuccess(Translations.dlgBorrowReturnSuccess)
            })
            return true;
        })
    }

    return <MiniPanel>
        <div className={"w-full flex flex-row"}>
            <div className={"w-full flex flex-col"}>
                <div className={"w-full flex flex-row"}>
                    <span className="min-w-fit mr-5 items-start text-align-left tracking-tight font-bold text-gray-300">
                        { Translations.dlgBorrowReturnMember }:
                    </span>
                    <span className="min-w-fit items-start text-align-left tracking-tight text-gray-300">
                        {borrow.memberFullName}
                    </span>
                </div>
                <div className={"w-full flex flex-row"}>
                    <span className="min-w-fit mr-5 items-start text-align-left tracking-tight font-bold text-gray-300">
                        { Translations.dlgBorrowReturnBook }:
                    </span>
                    <span className="min-w-fit items-start text-align-left tracking-tight text-gray-300">
                        {borrow.bookName}
                    </span>
                </div>
                <div className={"w-full flex flex-row"}>
                    <span className="min-w-fit mr-5 items-start text-align-left tracking-tight font-bold text-gray-300">
                        { Translations.dlgBorrowReturnSince }:
                    </span>
                    <span className="min-w-fit items-start text-align-left tracking-tight text-gray-300">
                        {new Date(borrow.borrowedAt + "Z").toUTCString()}
                    </span>
                </div>
            </div>

            <div className={"w-full flex flex-col ml-10"}>
                <FullWidthButton
                    text={(showReturn ? Translations.dlgHide : Translations.dlgBorrowReturnBtn)}
                    icon={( showReturn ? undefined : <MdAssignmentReturned size={20} className="text-gray-200" /> )}
                    onClick={() => setShowReturn(r => !r)} />
                { !showReturn ? undefined :
                    <div className={"w-full mt-2"}>
                        <FormControl className={"w-full"} margin={"dense"}>
                            <InputLabel id="demo-simple-select-label">{Translations.dlgBorrowShelfField}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedShelf}
                                label={Translations.dlgBorrowShelfField}
                                onChange={(e) => { setSelectedShelf(e.target.value)}}
                            >
                                { shelves.map((r, k) => {
                                    return <MenuItem key={k} value={r.id}>{ r.shelfName }</MenuItem>
                                }) }
                            </Select>
                        </FormControl>
                        <div className={"w-full mt-2"}>
                            <FullWidthButton
                                text={Translations.dlgBorrowReturnBtn}
                                icon={<MdAssignmentReturned size={20} className="text-gray-200" />}
                                onClick={onReturn} />
                        </div>
                    </div>
                }
            </div>
        </div>
    </MiniPanel>
}

const BorrowingPanel = () => {
    const { getBorrowTicketByStatus, getAllShelves, bookRenderTrigger } = useLibmanageFunctions()
    const [borrowDetails, setBorrowDetails] = useState([] as BorrowTicket[])
    const [shelves, setShelves] = useState([] as ShelfDetails[])

    useEffect(() => {
        getAllShelves().then(r => setShelves(r))
    }, [bookRenderTrigger]);

    useEffect(() => {
        getBorrowTicketByStatus(false).then(r => {
            setBorrowDetails(r.sort((a, b) => {
                if (a.borrowedAt === b.borrowedAt) return 0
                if (a.borrowedAt < b.borrowedAt) return -1
                return 1
            }))
        })
    }, [bookRenderTrigger]);

    return <MiniInnerPanel panelName={Translations.dashboardBorrowingTitle}>
        <div className={"max-h-screen overflow-y-auto w-full flex flex-col"}>
            { borrowDetails.map((r, k) => {
                return <BorrowDetailsCard borrow={r} shelves={shelves} key={k} />
            }) }
        </div>
    </MiniInnerPanel>
}

const MemberPanel = () => {
    const [showAddMember, setShowAddMember] = useState(false)
    const dummyRef = useRef<HTMLDivElement>(null);

    const scrollIntoView = () => {
        dummyRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }

    return <MiniPanel>
        <div className={"w-full flex flex-col"}>
            <div className={"w-full flex flex-row"}>
                <div className="min-w-fit mb-2 mt-5 items-start text-align-left text-xl font-bold tracking-tight text-gray-300">
                    { Translations.dashboardMember }
                </div>
                <div className={"w-full"}/>
                <div className={"min-w-fit"}>
                    <BigShinyButton
                        text={(showAddMember ? Translations.dlgHide : Translations.dashboardAddMember)}
                        icon={(showAddMember ? undefined : <IoMdAddCircle size={25} className="text-gray-200" />)}
                        onClick={() => {
                            if (!showAddMember) scrollIntoView()
                            setShowAddMember(r => !r)
                        }} />
                </div>
            </div>
            <div className={"max-w-full max-h-screen flex flex-col overflow-y-auto pb-10"}>
                <div ref={dummyRef} />
                { !showAddMember ? undefined :
                    <AddMemberPanel /> }
                <MemberSearch />
                <BorrowingPanel />
            </div>
        </div>
    </MiniPanel>
}

const MainArea = () => {
    return <div className="chatroom pl-20 pr-5">
        <div className={"w-full flex flex-col"}>
            <HelloBar/>
            <div className={"w-full flex flex-row"}>
                <div className={"mr-2 w-full"}>
                    <TotalBooks />
                </div>
                <div className={"ml-2 w-full"}>
                    <TotalEmployees />
                </div>
            </div>
            <div className={"w-full flex flex-row"}>
                <div className={"mr-2 w-full"}>
                    <TotalMembers />
                </div>
                <div className={"ml-2 w-full"}>
                    <RoleDisplay />
                </div>
            </div>
            <div className={"w-full flex flex-row"}>
                <div className={"w-full flex mr-2"}>
                    <BookShelf />
                </div>
                <div className={"w-full flex ml-2"}>
                    <MemberPanel />
                </div>
            </div>
        </div>
    </div>
}

const DashBoard = () => {
    return <div className={'screen-bg'}>
        <SideBar />
        <MainArea />
    </div>
}

export default DashBoard
