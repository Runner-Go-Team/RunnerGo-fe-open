import React from 'react';
import { useSelector } from 'react-redux';
import { Project as SvgProject } from 'adesign-react/icons';

import { isArray, sortBy } from 'lodash';
import { ProjectItem } from './style';


const ProjectList = (props) => {
  const { projects, handleSwitchProject } = props;

  const currentProjectId = useSelector((store) => store.workspace.CURRENT_PROJECT_ID);

  const sortedList = isArray(projects) ? sortBy(projects, ['create_dtime']) : [];

  return (
    <>
      {sortedList?.map((project) => (
        <ProjectItem
          onClick={handleSwitchProject.bind(null, project.project_id)}
          key={project.project_id}
          isActive={project.project_id === currentProjectId}
        >
          <SvgProject className="picon" />
          <span className="ptitle">
            {project.name}
            {project?.is_push === -1 && <font color="var(--font-3)">【未上传】</font>}
          </span>
        </ProjectItem>
      ))}
    </>
  );
};

export default ProjectList;
