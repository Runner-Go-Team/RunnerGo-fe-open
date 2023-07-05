import React, { useState, useEffect } from "react";
import './index.less';
import EnvMenu from "./EnvMenu";
import EnvDetail from "./EnvDetail";

const Env = () => {
    const [selectEnvId, setEnvId] = useState(0);
    const [selectEnvName, setEnvName] = useState('');
    

    return (
        <div className="env-page">
            <EnvMenu handleSelectEnv={(e) => setEnvId(e)} handleEnvName={(e) => setEnvName(e)} />
            <EnvDetail selectEnvId={selectEnvId} selectEnvName={selectEnvName} />
        </div>
    )
};

export default Env;