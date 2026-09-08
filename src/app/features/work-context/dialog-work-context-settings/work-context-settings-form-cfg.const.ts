import { FormlyFieldConfig } from '@ngx-formly/core';
import { T } from '../../../t.const';
import { WORK_CONTEXT_THEME_CONFIG_FORM_CONFIG } from '../work-context.const';

export const buildWorkContextSettingsFormCfg = (
  isProject: boolean,
): FormlyFieldConfig[] => {
  const basicFields: FormlyFieldConfig[] = [
    {
      key: 'title',
      type: 'input',
      templateOptions: {
        required: true,
        label: isProject ? T.F.PROJECT.FORM_BASIC.L_TITLE : T.F.TAG.FORM_BASIC.L_TITLE,
      },
    },
    {
      key: 'icon',
      type: 'icon',
      templateOptions: {
        label: T.F.TAG.FORM_BASIC.L_ICON,
        description: T.G.ICON_INP_DESCRIPTION,
      },
    },
  ];

  if (!isProject) {
    basicFields.push({
      key: 'color',
      type: 'color',
      templateOptions: {
        label: T.F.TAG.FORM_BASIC.L_COLOR,
      },
    });
  }

  if (isProject) {
    basicFields.push(
      {
        key: 'isEnableBacklog',
        type: 'checkbox',
        templateOptions: {
          label: T.F.PROJECT.FORM_BASIC.L_ENABLE_BACKLOG,
        },
      },
      {
        key: 'isHiddenFromMenu',
        type: 'checkbox',
        templateOptions: {
          label: T.F.PROJECT.FORM_BASIC.L_IS_HIDDEN_FROM_MENU,
        },
      },
      // Plane-parity sub-pages. Each toggles one tab in the project's tab bar
      // (see ProjectShellComponent) — the same shape as the app-wide
      // `appFeatures()` gating, but scoped to a single project.
      {
        key: 'planeFeatureFlags.cyclesEnabled',
        type: 'checkbox',
        templateOptions: {
          label: T.F.PROJECT.FORM_BASIC.L_ENABLE_CYCLES,
        },
      },
      {
        key: 'planeFeatureFlags.modulesEnabled',
        type: 'checkbox',
        templateOptions: {
          label: T.F.PROJECT.FORM_BASIC.L_ENABLE_MODULES,
        },
      },
      {
        key: 'planeFeatureFlags.viewsEnabled',
        type: 'checkbox',
        templateOptions: {
          label: T.F.PROJECT.FORM_BASIC.L_ENABLE_VIEWS,
        },
      },
      {
        key: 'planeFeatureFlags.pagesEnabled',
        type: 'checkbox',
        templateOptions: {
          label: T.F.PROJECT.FORM_BASIC.L_ENABLE_PAGES,
        },
      },
      {
        key: 'planeFeatureFlags.intakeEnabled',
        type: 'checkbox',
        templateOptions: {
          label: T.F.PROJECT.FORM_BASIC.L_ENABLE_INTAKE,
        },
      },
    );
  }

  const sharedItems = WORK_CONTEXT_THEME_CONFIG_FORM_CONFIG.items!;
  const colorFields = sharedItems.slice(0, 3).map((field, index) =>
    !isProject && index === 0
      ? {
          ...field,
          templateOptions: {
            ...field.templateOptions,
            description: T.F.TAG.FORM_BASIC.D_COLOR,
          },
        }
      : field,
  );
  const remainingFields = sharedItems.slice(3);

  const themeFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'formly-row',
      fieldGroup: colorFields,
    },
    ...remainingFields,
  ];

  return [
    ...basicFields,
    {
      key: 'theme',
      fieldGroup: themeFields,
    },
  ];
};
