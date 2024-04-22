import React from "react";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Dayjs} from "dayjs";

export const MiniPanel: React.FC<{ panelName?: string, children?: React.ReactNode }> = ({ panelName, children }) => {
    return <div className="w-full bg-sidebar rounded-lg shadow-lg pt-8 pb-4 px-10 my-5 text-gray-200">
        { panelName ? <div className="mb-2 items-start text-align-left text-xl font-bold tracking-tight text-gray-300">
            { panelName }
        </div> : undefined }
        { children }
    </div>
}

export const MiniInnerPanel: React.FC<{ panelName?: string, children?: React.ReactNode }> = ({ panelName, children }) => {
    return <div className="w-full bg-chatbg rounded-lg shadow-lg pt-8 pb-4 px-10 my-5 text-gray-200">
        { panelName ? <div className="mb-2 items-start text-align-left text-xl font-bold tracking-tight text-gray-300">
            { panelName }
        </div> : undefined }
        { children }
    </div>
}

export const BasicDatePicker: React.FC<{ readOnly?: boolean, label: string | undefined, value: Dayjs, onChange: (date: Dayjs) => void | undefined }> = ({ readOnly, label, value, onChange }) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker', 'DatePicker']}>
                <DatePicker
                    readOnly={readOnly}
                    label={label ? label : "Date picker"}
                    value={value}
                    onChange={onChange as any}
                    className={"w-full"}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}
