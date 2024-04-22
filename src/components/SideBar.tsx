import {BiLogOut} from 'react-icons/all'
import { MdDashboard } from "react-icons/md";
import { FaCog } from "react-icons/fa";

import { useLibmanageAuth } from "../contexts/LibmanageAuthProvider.tsx";
import { LibmanageAuthContextType } from "../contexts/LibmanageAuthContextType.ts";
import {Link, useNavigate} from "react-router-dom";
import Translations from "../I18N.ts";

export default function SideBar() {
	const { logout, userSession } = useLibmanageAuth() as LibmanageAuthContextType;
	const navigate = useNavigate();
	return (
		<div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col
					  bg-sidebar text-white shadow">
			<RedirectButton customCss={"discord-icon group"} to="/" icon={<MdDashboard size="28"/>} text={Translations.dashboardLabel}/>
			{ userSession.current.role !== "SUPERUSER" ? undefined :
				<>
					<Divider />
					<RedirectButton customCss={"discord-icon group"} to="/manage" icon={<FaCog size="28"/>} text={Translations.manageLabel}/>
				</>
			}
			<div className="flex flex-grow flex-col justify-end h-max">
				<EventfulButton icon={<BiLogOut size="28"/>} text={Translations.logoutLabel} event={() => {
						logout();
						navigate("/login")
					}}/>
			</div>
		</div>
	);
}

const RedirectButton = ({ icon, text, to, customCss }: { icon: JSX.Element, text: string, to: string, customCss?: string }) => {
	return (<Link to={to} className={customCss ? customCss : "sidebar-icon group"}>
		{icon}
		<span className="sidebar-tooltip group-hover:scale-100">
			{text}
		</span>
	</Link>)
}
const EventfulButton = ({ icon, text, event }: { icon: JSX.Element, text: string, event: () => void }) => {
	return (
		<div className="sidebar-icon bottom-0 group" onClick={event}>
			{icon}
			<span className="sidebar-tooltip group-hover:scale-100">
				{text}
			</span>
		</div>
	)
}

const Divider = () => <hr className="sidebar-hr" />;
