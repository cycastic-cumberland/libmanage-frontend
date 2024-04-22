import {Link} from "react-router-dom";
import AuthBox from "./AuthBox.tsx";
import Translations from "../I18N.ts";

const FourOFour = () => {
    return <AuthBox>
        <div className={"login-container"}>
            <h2 className="login-container-header">{Translations.notFoundLabel}</h2>
            <p className="mt-2 text-center text-sm text-gray-400">
                {Translations.notFoundReturnFirst}
                <Link className="login-container-switch" to={"/"}> {Translations.notFoundReturnSecond}</Link>
            </p>
        </div>
    </AuthBox>
}

export default FourOFour;