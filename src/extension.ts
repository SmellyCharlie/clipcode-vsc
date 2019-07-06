import { commands, window, env, ExtensionContext } from 'vscode'
import * as queryString from 'query-string'
import nodeFetch from 'node-fetch'
import { showQuickPick } from './quick-pick'

const url = 'https://clipco.de/%'

export function activate(context: ExtensionContext) {

	context.subscriptions.push(commands.registerCommand('extension.clipcode', async () => {

		let editor = window.activeTextEditor

		if (editor) {
			try {
				const document = editor.document
				const selection = editor.selection
				const language = document.languageId
				let word = document.getText(selection)
				console.log(word)
				// if ((selection.start.line === selection.end.line) && (selection.start.character === selection.end.character)) {
				if (!word) {
					if (await showQuickPick() === 'Cancel') {
						return;
					}
					word = document.getText()
				}

				const payload = { code: word, language: language }
				const postUrl = `${url.replace('%', 'upload.php')}`
				const res = await nodeFetch(postUrl, {
					method: 'POST',
					headers: {
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36',
						'Accept-Encoding': 'gzip, deflate',
						'Connection': 'keep-alive',
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: queryString.stringify(payload)
				})
				const resText = await res.text()
				const pasteUrl = `${url.replace('%', resText)}`

				await env.clipboard.writeText(pasteUrl)
				window.showInformationMessage(`${pasteUrl} copied to clipboard.`)
			}
			catch (error) {
				window.showErrorMessage(`Something broke: ${error}`)
			}
		}
	}));
}

export function deactivate() { }
