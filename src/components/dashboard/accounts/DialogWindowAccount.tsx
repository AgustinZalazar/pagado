"use client"
import React from "react";
import { useTranslations } from "next-intl";
import FormAccount from "./FormAccount";
import { ShineButton } from "../buttons/ShineButton";
import { ReusableDialogWindow } from "../windows/ReusableDialogWindow";

export function DialogWindowAccount() {
    const t = useTranslations('Dashboard.Accounts');

    return (
        <ReusableDialogWindow
            title={t("title")}
            description={t("descriptionDialog")}
            trigger={<ShineButton text={t("buttonAdd")} />}
        >
            {({ setOpenDialog }) => (
                <FormAccount setOpenPopover={setOpenDialog} />
            )}
        </ReusableDialogWindow>
    )
}
