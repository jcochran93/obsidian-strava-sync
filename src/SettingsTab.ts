import { App, Notice, PluginSettingTab, Setting } from "obsidian";
import StravaSync from "./StravaSync";
import { DEFAULT_SETTINGS, VALID_FRONT_MATTER_PROPERTIES } from "./Settings";

export class SettingsTab extends PluginSettingTab {
  plugin: StravaSync;

  constructor(app: App, plugin: StravaSync) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h3', { text: 'Authentication' });

    new Setting(containerEl)
      .setName('Strava Client ID')
      .setDesc('Enter your Strava API Client ID')
      .addText(text => text
        .setPlaceholder('Enter Client ID')
        .setValue(this.plugin.settings.authentication.stravaClientId)
        .onChange(async (value) => {
          this.plugin.settings.authentication.stravaClientId = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Strava Client Secret')
      .setDesc('Enter your Strava API Client Secret')
      .addText(text => text
        .setPlaceholder('Enter Client Secret')
        .setValue(this.plugin.settings.authentication.stravaClientSecret)
        .onChange(async (value) => {
          this.plugin.settings.authentication.stravaClientSecret = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Authenticate with Strava')
      .setDesc('Click to start the OAuth flow with Strava')
      .addButton(button => button
        .setButtonText('Authenticate')
        .onClick(() => {
          this.plugin.authentication.initiateOAuthFlow();
        }));

    containerEl.createEl('h3', { text: 'Sync Location' });

    new Setting(containerEl)
      .setName('Folder')
      .setDesc(
        'Enter the folder where the data will be stored. {{id}}, {{name}} and {{start_date}} can be used in the folder name',
      )
      .addText(text => text
        .setPlaceholder('Enter the folder')
        .setValue(this.plugin.settings.syncLocation.folder)
        .onChange(async (value) => {
          this.plugin.settings.syncLocation.folder = value
          await this.plugin.saveSettings()
        }));

    new Setting(containerEl)
      .setName('Folder date format')
      .setDesc(
        createFragment((fragment) => {
          fragment.append(
            'If date is used as part of folder name, specify the format date for use. Format ',
            fragment.createEl('a', {
              text: 'reference',
              href: 'https://moment.github.io/luxon/#/formatting?id=table-of-tokens',
            }),
            "."
          )
        }),
      )
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.syncLocation.folderDateFormat)
          .setValue(this.plugin.settings.syncLocation.folderDateFormat)
          .onChange(async (value) => {
            this.plugin.settings.syncLocation.folderDateFormat = value
            await this.plugin.saveSettings()
          }),
      )

    new Setting(containerEl)
      .setName('Filename')
      .setDesc(
        'Enter the filename where the data will be stored. {{id}}, {{name}} and {{start_date}} can be used in the filename',
      )
      .addText((text) =>
        text
          .setPlaceholder('Enter the filename')
          .setValue(this.plugin.settings.syncLocation.filename)
          .onChange(async (value) => {
            this.plugin.settings.syncLocation.filename = value
            await this.plugin.saveSettings()
          }),
      )

    new Setting(containerEl)
      .setName('Filename date format')
      .setDesc(
        createFragment((fragment) => {
          fragment.append(
            'If date is used as part of file name, specify the format date for use. Format ',
            fragment.createEl('a', {
              text: 'reference',
              href: 'https://moment.github.io/luxon/#/formatting?id=table-of-tokens',
            }),
            "."
          )
        }),
      )
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.syncLocation.filenameDateFormat)
          .setValue(this.plugin.settings.syncLocation.filenameDateFormat)
          .onChange(async (value) => {
            this.plugin.settings.syncLocation.filenameDateFormat = value
            await this.plugin.saveSettings()
          }),
      )

    containerEl.createEl('h3', { text: 'Activity' })

    new Setting(containerEl)
      .setName('Front matter')
      .setDesc(
        createFragment((fragment) => {
          fragment.append(
            'Enter the metadata to be used in your note separated by commas.'
          )
        }),
      )
      .addTextArea((text) => {
        text
          .setPlaceholder('Enter the metadata')
          .setValue(this.plugin.settings.activity.frontMatterProperties.join(','))
          .onChange(async (value) => {
            this.plugin.settings.activity.frontMatterProperties = value
              .split(',')
              .map((v) => v.trim())
              .filter((v, i, a) => VALID_FRONT_MATTER_PROPERTIES.includes(v) && a.indexOf(v) === i)
            await this.plugin.saveSettings()
          })
        text.inputEl.setAttr('rows', 4)
        text.inputEl.setAttr('cols', 30)
      })

    new Setting(containerEl)
      .setName('Activity date format')
      .setDesc(
        createFragment((fragment) => {
          fragment.append(
            'If date is used as part of activity content, specify the format date for use. Format ',
            fragment.createEl('a', {
              text: 'reference',
              href: 'https://moment.github.io/luxon/#/formatting?id=table-of-tokens',
            }),
            "."
          )
        }),
      )
      .addText((text) =>
        text
          .setPlaceholder(DEFAULT_SETTINGS.activity.contentDateFormat)
          .setValue(this.plugin.settings.activity.contentDateFormat)
          .onChange(async (value) => {
            this.plugin.settings.activity.contentDateFormat = value
            await this.plugin.saveSettings()
          }),
      )

    new Setting(containerEl)
      .setName('Activity template')
      .setDesc(
        createFragment((fragment) => {
          fragment.append("Enter template to render activities with")
        }),
      )
      .addExtraButton((button) => {
        // Add a button to reset template
        button
          .setIcon('reset')
          .setTooltip('Reset template')
          .onClick(async () => {
            this.plugin.settings.activity.template = DEFAULT_SETTINGS.activity.template
            await this.plugin.saveSettings()
            this.display()
            new Notice('Template reset')
          })
      })
      .addTextArea((text) => {
        text
          .setPlaceholder('Enter the template')
          .setValue(this.plugin.settings.activity.template)
          .onChange(async (value) => {
            this.plugin.settings.activity.template = value
              ? value
              : DEFAULT_SETTINGS.activity.template
            await this.plugin.saveSettings()
          })
        text.inputEl.setAttr('rows', 15)
        text.inputEl.setAttr('cols', 50)
      })
  }
}
