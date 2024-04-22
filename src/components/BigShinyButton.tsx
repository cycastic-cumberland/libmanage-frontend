import React from "react";
import {AiOutlinePlus, MdOutlineCreate} from "react-icons/all";
import { CiBookmark } from "react-icons/ci";
import {Button, Form} from "react-bootstrap";
import Translations from "../I18N.ts";

type CallbackType = (() => void) | (() => Promise<void>);

export const BigShinyButton: React.FC<{ disabled?: boolean, text?: string, icon?: JSX.Element, onClick?: (() => void) | (() => Promise<void>) }> = ({ disabled, text, icon, onClick }) => {
    return <div className="flex flex-col items-center">
        <div className="px-4 py-3 mt-3 rounded-md shadow-md
             text-white bg-btndefault text-sm font-bold flex w-max
             transition-all duration-300 hover:bg-btnactive cursor-pointer" onClick={onClick}>
            <div className="flex w-full mx-6 items-center">
                {icon}
                <button disabled={disabled} className="ml-2 text-center">
                    { text }
                </button>
            </div>
        </div>
    </div>
}

export const FullWidthButton: React.FC<{ disabled?: boolean, text?: string, icon?: JSX.Element, onClick?: (() => void) | (() => Promise<void>) }> = ({ disabled, text, icon, onClick }) => {
    return <div className="w-full flex flex-col items-center">
        <div className="px-4 py-3 mt-3 rounded-md shadow-md
             text-white bg-btndefault text-sm font-bold flex w-full
             transition-all duration-300 hover:bg-btnactive cursor-pointer" onClick={onClick}>
            <div className="flex w-full mx-6 items-center justify-center">
                {icon}
                <button disabled={disabled} className="ml-2 text-center">
                    { text }
                </button>
            </div>
        </div>
    </div>
}

export const BorrowButton: React.FC<{ onClick?: CallbackType }> = ({ onClick }) => {
    return <FullWidthButton text={Translations.dlgBorrowBtn} icon={<CiBookmark className="text-gray-200" />} onClick={onClick} />
}

export const CreateBoardButton: React.FC<{ onClick?: CallbackType }> = ({ onClick }) => {
    return <BigShinyButton text={"Create new board"} icon={<MdOutlineCreate className="text-gray-200" />} onClick={onClick} />
}

export const CreateInvitationButton: React.FC<{ onClick?: CallbackType }> = ({ onClick }) => {
    return <div className="flex flex-col items-center">
        <div className="px-4 py-3 mt-3 rounded-md shadow-md
             text-white bg-btndefault text-sm font-bold flex w-full
             transition-all duration-300 hover:bg-btnactive cursor-pointer" onClick={onClick}>
            <div className="flex w-full mx-6 items-center justify-center">
                <AiOutlinePlus className="text-gray-200" />
                <div className="ml-2 text-center">
                    Add invitation
                </div>
            </div>
        </div>
    </div>
}

export const BigBlackBox: React.FC<{ header: string, modalLevel?: string, actionCancel?: CallbackType, children?: React.ReactNode }> = ({ header, modalLevel, children }) => {
    return <div className={`fixed top-0 left-0 w-screen h-screen flex justify-center items-center ${modalLevel ? modalLevel : "modal-2"}`}>
        <div className="flex flex-col top-0 left-0 w-max h-max items-start justify-start">
            <div className="bg-sidebar rounded-lg shadow-lg py-6 px-10">
                <div className='py-5'>
                    <div className='w-full max-w-md space-y-8'>
                        <div className="container border-solid box-border border-indigo-600">
                            <div>
                                <h2 className="mt-3 items-start text-align-left text-xl font-bold tracking-tight text-gray-300">
                                    { header }
                                </h2>
                            </div>
                        </div>
                        { children }
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export const ConfirmationBox: React.FC<{ header: string, customModal?: string, customSubmitMessage?: string, onClose?:CallbackType, onSubmit?: React.FormEventHandler<HTMLFormElement>, children?: React.ReactNode, submitRef?: React.MutableRefObject<HTMLButtonElement | null> }> = ({ header, customModal, customSubmitMessage, onClose, onSubmit, children, submitRef }) => {
    return <BigBlackBox modalLevel={customModal ? customModal : "modal-2"} header={header}>
        <Form onSubmit={onSubmit} className="w-full text-gray-300">
            {children}
            <div className="flex mt-4 flex-row w-full items-end justify-end">
                <Button ref={submitRef} type="submit" className="group login-form-submit mx-2 w-max">
                    {customSubmitMessage ? customSubmitMessage : Translations.dlgConfirm}
                </Button>
                <button type="button" className="login-form-submit mx-2 w-max" onClick={onClose}>{Translations.dlgClose}</button>
            </div>
        </Form>
    </BigBlackBox>
}
