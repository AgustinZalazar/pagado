import React from "react";
import { useTranslations } from "next-intl";
import { FormCategory } from "../FormCategories";
import { ShineButton } from "../../buttons/ShineButton";
import { ReusableDialogWindow } from "@/components/dashboard/windows/ReusableDialogWindow";

export function NewCategoryWindow() {
    const t = useTranslations('Dashboard.Budget');

    return (
        <ReusableDialogWindow
            title={t("titleDialog")}
            description={t("descriptionDialog")}
            trigger={<ShineButton text={t("addButton")} />}
        >
            {({ setOpenDialog }) => (
                <FormCategory setOpenPopover={setOpenDialog} />
            )}
        </ReusableDialogWindow>
    )
}
