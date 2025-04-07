import { WORK, WORK_LOCKED } from "@constants/personalScreenConstants";
import { DOCUMENT, DOCUMENT_LOCKED } from "@constants/workScreenConstant";

export const canAccessWorkTab = (isChangeDetect, isPersonalDone) => {
    return !isChangeDetect && isPersonalDone;
};

export const canAccessDocumentTab = (isChangeDetect, isWorkChangeDetect, isWorkDone) => {
    return !isChangeDetect && !isWorkChangeDetect && isWorkDone;
};

export const getWorkTabLabel = (isChangeDetect, isPersonalDone) => {
    return canAccessWorkTab(isChangeDetect, isPersonalDone) ? WORK : WORK_LOCKED;
};

export const getDocumentTabLabel = (isChangeDetect, isWorkChangeDetect, isWorkDone) => {
    return canAccessDocumentTab(isChangeDetect, isWorkChangeDetect, isWorkDone)
        ? DOCUMENT
        : DOCUMENT_LOCKED;
};
