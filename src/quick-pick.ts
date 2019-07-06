import {window} from 'vscode'
export async function showQuickPick() {
	return await window.showQuickPick(['Cancel', 'Send whole file'], {
		placeHolder: 'No selection in document. Abort or clipco.de the whole file?',
		ignoreFocusOut: true,
	});
}
