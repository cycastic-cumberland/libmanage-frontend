import SideBar from "./SideBar.tsx";
import {useLibmanageAuth} from "../contexts/LibmanageAuthProvider.tsx";
import {MiniInnerPanel, MiniPanel} from "./BasicComponents.tsx";
import Translations from "../I18N.ts";
import {ConfirmationBox, FullWidthButton} from "./BigShinyButton.tsx";
import React, {useEffect, useRef, useState} from "react";
import {IoMdAddCircle} from "react-icons/io";
import {TextField} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {useLibmanageLog} from "../contexts/LibmanageLogProvider.tsx";
import {
    EmployeeDetails,
    ShelfInfo,
    useLibmanageFunctions
} from "../contexts/LibmanageFunctionsProvider.tsx";
import {TiDelete} from "react-icons/all";

const EmployeeCard: React.FC<{ employee: EmployeeDetails }> = ({ employee }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const {userSession} = useLibmanageAuth()
    const [loading, setLoading] = useState(false)
    const { deleteEmployee } = useLibmanageFunctions()
    const { addSuccess } = useLibmanageLog()

    const onSubmit = () => {
        setShowDeleteConfirm(false)
        setLoading(l => {
            if (l) return l
            deleteEmployee(employee.id).then(r => {
                setLoading(false)
                if (r > 0) addSuccess(Translations.dlgDeleteMemberSuccess)
            })
            return true
        })
    }

    const onCancel = () => {
        setShowDeleteConfirm(false)
    }

    return <MiniInnerPanel>
        <div className={"w-full flex flex-row mb-3"}>
            <div className={"min-w-fit flex"}>
                <span className={"text-xl tracking-tight text-gray-300 mt-5 mr-5 font-bold"}>
                    { employee.id }
                </span>
            </div>
            <div className={"min-w-fit flex"}>
                <span className={"text-xl tracking-tight text-gray-300 mt-5 mr-5"}>
                    { employee.fullName }
                </span>
            </div>
            <div className={"min-w-fit flex"}>
                <span className={"text-xl tracking-tight text-gray-300 mt-5 mr-5 font-bold"}>
                    { employee.role }
                </span>
            </div>
            <div className={"w-full"}/>
            { userSession.current.id === employee.id ? undefined :
                <div className={"min-w-fit flex"}>
                    <FullWidthButton
                        disabled={loading}
                        text={Translations.manageEmployeeDeleteBtn}
                        icon={<TiDelete size={20} className="text-gray-200" />}
                        onClick={() => setShowDeleteConfirm(r => !r)} />
                </div>
            }
        </div>
        { !showDeleteConfirm ? undefined :
            <ConfirmationBox header={Translations.dlgDeleteMember} onSubmit={onSubmit} onClose={onCancel}>
                <div className={"min-w-fit mb-5 mx-5"}>
                    { Translations.dlgDeleteMemberConfirmation }
                </div>
            </ConfirmationBox>
        }
    </MiniInnerPanel>
}

const ManageEmployees = () => {
    const [showReturn, setShowReturn] = useState(false)
    const idBox = useRef(null as any as HTMLInputElement)
    const nameBox = useRef(null as any as HTMLInputElement)
    const passwordBox = useRef(null as any as HTMLInputElement)
    const [selectedRole, setSelectedRole] = useState('COMMON')
    const [employees, setEmployees] = useState([] as EmployeeDetails[])
    const [loading, setLoading] = useState(false)
    const { createEmployeeAccount, getAllEmployees, searchEmployees, employeeRenderTrigger } = useLibmanageFunctions()
    const {addError, addSuccess} = useLibmanageLog()
    const [searchTrigger, setSearchTrigger] = useState(0)
    const [_, setIsFetching] = useState(false)
    const searchBox = useRef(null as any as HTMLInputElement)
    const searchTriggerFatigue = 100

    const specialCharacterPattern = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

    const onReceived = (r: EmployeeDetails[]) => {
        setIsFetching(false)
        setEmployees(r)
    }

    useEffect(() => {
        setIsFetching(l => {
            if (l) return l
            if (searchBox.current.value) searchEmployees(searchBox.current.value).then(onReceived)
            else getAllEmployees().then(onReceived)
            return true;
        })
    }, [employeeRenderTrigger, searchTrigger]);

    const handleSubmit: React.KeyboardEventHandler<HTMLInputElement> = async (_) => {
        const curr = new Date().valueOf()
        if (searchTrigger < curr - searchTriggerFatigue)
            setSearchTrigger(curr)
    };

    const onSubmit = () => {
        setLoading(l => {
            if (l) return l;
            if (!idBox.current.value) {
                addError(Translations.manageEmployeeAddNoIdField)
                return false
            }
            if (specialCharacterPattern.test(idBox.current.value)) {
                addError(Translations.manageEmployeeAddIdFieldInvalid)
                return false
            }
            if (!nameBox.current.value){
                addError(Translations.manageEmployeeAddNoNameField)
                return false
            }
            if (!passwordBox.current.value){
                addError(Translations.manageEmployeeAddNoPassField)
                return false
            }
            if (passwordBox.current.value.length <= 6){
                addError(Translations.manageEmployeeAddPassFieldInvalid)
                return false
            }
            createEmployeeAccount({
                id: idBox.current.value,
                fullName: nameBox.current.value,
                password: passwordBox.current.value,
                role: selectedRole
            }).then (r => {
                setLoading(false)
                if (r) addSuccess(Translations.manageEmployeeAddSuccess)
            })
            return true;
        })
    }

    return <div className={"w-full mr-5"}>
        <MiniPanel>
            <div className={"w-full max-h-screen flex flex-col overflow-y-auto"}>
                <div className={"w-full flex flex-row"}>
                    <div className={"mr-2 min-w-fit"}>
                        <div className="mb-2 mt-5 items-start text-align-left text-xl font-bold tracking-tight text-gray-300">
                            {Translations.manageEmployeeTitle}
                        </div>
                    </div>
                    <div className={"w-full mx-3"}>
                        <TextField onKeyDown={handleSubmit} inputRef={searchBox} className={"w-full"} margin={"dense"} id="outlined-basic" label={Translations.manageEmployeeSearch} variant="outlined" />
                    </div>
                    <div className={"min-w-fit"}>
                        <FullWidthButton
                            text={(showReturn ? Translations.dlgHide : Translations.manageEmployeeAddBtn)}
                            icon={( showReturn ? undefined : <IoMdAddCircle size={20} className="text-gray-200" /> )}
                            onClick={() => setShowReturn(r => !r)} />
                    </div>
                </div>
                { !showReturn ? undefined :
                    <MiniInnerPanel>
                        <TextField inputRef={idBox} className={"w-full mt-2"} margin={"dense"} id="outlined-basic" label={Translations.manageEmployeeIdField} variant="outlined" />
                        <TextField inputRef={nameBox} className={"w-full mt-2"} margin={"dense"} id="outlined-basic" label={Translations.manageEmployeeNameField} variant="outlined" />
                        <TextField type={"password"} inputRef={passwordBox} className={"w-full mt-2"} margin={"dense"} id="outlined-basic" label={Translations.manageEmployeePassField} variant="outlined" />
                        <FormControl className={"w-full mt-2 mb-2"} margin={"dense"}>
                            <InputLabel id="demo-simple-select-label">{Translations.manageEmployeeRoleField}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedRole}
                                label={Translations.manageEmployeeRoleField}
                                onChange={(e) => { setSelectedRole(e.target.value)}}
                            >
                                <MenuItem value={"COMMON"}>{Translations.manageEmployeeRoleCommon}</MenuItem>
                                <MenuItem value={"SUPERUSER"}>{Translations.manageEmployeeAddRoleSuperuser}</MenuItem>
                            </Select>
                        </FormControl>
                        <FullWidthButton
                            disabled={loading}
                            text={Translations.manageEmployeeAddBtn}
                            icon={<IoMdAddCircle size={20} className="text-gray-200" />}
                            onClick={onSubmit} />
                    </MiniInnerPanel>}
                { employees.map((r, k) => <EmployeeCard key={k} employee={r} />) }
            </div>
        </MiniPanel>
    </div>
}

const ShelfCard: React.FC<{ shelf: ShelfInfo }> = ({ shelf }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const { deleteShelf } = useLibmanageFunctions()
    const { addSuccess } = useLibmanageLog()

    const onSubmit = () => {
        setShowDeleteConfirm(false)
        setLoading(l => {
            if (l) return l
            deleteShelf(shelf.id).then(r => {
                setLoading(false)
                if (r > 0) addSuccess(Translations.dlgDeleteMemberSuccess)
            })
            return true
        })
    }
    const onCancel = () => {
        setShowDeleteConfirm(false)
    }

    return <MiniInnerPanel>
        <div className={"w-full flex flex-row mb-3"}>
            <div className={"min-w-fit flex"}>
                <span className={"text-xl tracking-tight text-gray-300 mt-5 mr-5 font-bold"}>
                    { shelf.id }
                </span>
            </div>
            <div className={"min-w-fit flex"}>
                <span className={"text-xl tracking-tight text-gray-300 mt-5 mr-5"}>
                    { shelf.shelfName }
                </span>
            </div>
            <div className={"min-w-fit flex"}>
                <span className={"text-xl tracking-tight text-gray-300 mt-5 mr-2"}>
                    { shelf.bookCount }
                </span>
                <span className={"text-xl tracking-tight text-gray-300 mt-5 mr-5"}>
                    { Translations.manageShelfAmount }
                </span>
            </div>
            <div className={"w-full"}/>
            <div className={"min-w-fit flex"}>
                <FullWidthButton
                    disabled={loading}
                    text={Translations.manageShelfDeleteBtn}
                    icon={<TiDelete size={20} className="text-gray-200" />}
                    onClick={() => setShowDeleteConfirm(r => !r)} />
            </div>
        </div>
        { !showDeleteConfirm ? undefined :
            <ConfirmationBox header={Translations.manageShelfDeleteBtn} onSubmit={onSubmit} onClose={onCancel}>
                <div className={"min-w-fit mb-5 mx-5"}>
                    { Translations.manageShelfDeleteConfirm }
                </div>
            </ConfirmationBox>
        }
    </MiniInnerPanel>
}

const ManageShelves = () => {
    const [showReturn, setShowReturn] = useState(false)
    const idBox = useRef(null as any as HTMLInputElement)
    const nameBox = useRef(null as any as HTMLInputElement)
    const [shelves, setShelves] = useState([] as ShelfInfo[])
    const [loading, setLoading] = useState(false)
    const { createShelf, searchShelvesInfo, getShelvesInfo, shelfRenderTrigger } = useLibmanageFunctions()
    const {addError, addSuccess} = useLibmanageLog()
    const [searchTrigger, setSearchTrigger] = useState(0)
    const [_, setIsFetching] = useState(false)
    const searchBox = useRef(null as any as HTMLInputElement)
    const searchTriggerFatigue = 100

    const onReceived = (r: ShelfInfo[]) => {
        setIsFetching(false)
        setShelves(r)
    }

    useEffect(() => {
        setIsFetching(l => {
            if (l) return l
            if (searchBox.current.value) searchShelvesInfo(searchBox.current.value).then(onReceived)
            else getShelvesInfo().then(onReceived)
            return true;
        })
    }, [shelfRenderTrigger, searchTrigger]);

    const handleSubmit: React.KeyboardEventHandler<HTMLInputElement> = async (_) => {
        const curr = new Date().valueOf()
        if (searchTrigger < curr - searchTriggerFatigue)
            setSearchTrigger(curr)
    };

    const onSubmit = () => {
        setLoading(l => {
            if (l) return l;
            if (!idBox.current.value) {
                addError(Translations.manageEmployeeAddNoIdField)
                return false
            }
            if (!nameBox.current.value){
                addError(Translations.manageEmployeeAddNoNameField)
                return false
            }
            createShelf({
                id: idBox.current.value,
                shelfName: nameBox.current.value
            }).then (r => {
                setLoading(false)
                if (r) addSuccess(Translations.manageShelfAddSuccess)
            })
            return true;
        })
    }

    return <div className={"w-full ml-5"}>
        <MiniPanel>
            <div className={"w-full max-h-screen flex flex-col overflow-y-auto"}>
                <div className={"w-full flex flex-row"}>
                    <div className={"mr-2 min-w-fit"}>
                        <div className="mb-2 mt-5 items-start text-align-left text-xl font-bold tracking-tight text-gray-300">
                            {Translations.manageShelfTitle}
                        </div>
                    </div>
                    <div className={"w-full mx-3"}>
                        <TextField onKeyDown={handleSubmit} inputRef={searchBox} className={"w-full"} margin={"dense"} id="outlined-basic" label={Translations.manageShelfSearch} variant="outlined" />
                    </div>
                    <div className={"min-w-fit"}>
                        <FullWidthButton
                            text={(showReturn ? Translations.dlgHide : Translations.manageShelfAdd)}
                            icon={( showReturn ? undefined : <IoMdAddCircle size={20} className="text-gray-200" /> )}
                            onClick={() => setShowReturn(r => !r)} />
                    </div>
                </div>
                { !showReturn ? undefined :
                    <MiniInnerPanel>
                        <TextField inputRef={idBox} className={"w-full mt-2"} margin={"dense"} id="outlined-basic" label={Translations.manageShelfAddId} variant="outlined" />
                        <TextField inputRef={nameBox} className={"w-full mt-2"} margin={"dense"} id="outlined-basic" label={Translations.manageShelfAddName} variant="outlined" />
                        <FullWidthButton
                            disabled={loading}
                            text={Translations.manageShelfAdd}
                            icon={<IoMdAddCircle size={20} className="text-gray-200" />}
                            onClick={onSubmit} />
                    </MiniInnerPanel>
                }
                { shelves.map((r, k) => <ShelfCard key={k} shelf={r} />) }
            </div>
        </MiniPanel>
    </div>
}

const MainArea = () => {
    return <div className="chatroom pl-20 pr-5">
        <div className={"w-full flex flex-row"}>
            <ManageEmployees />
            <ManageShelves />
        </div>
    </div>
}

const Management = () => {
    const {userSession} = useLibmanageAuth()

    return <div className={'screen-bg'}>
        <SideBar />
        { userSession.current.role === "SUPERUSER" ? <MainArea /> : undefined }
    </div>
}

export default Management