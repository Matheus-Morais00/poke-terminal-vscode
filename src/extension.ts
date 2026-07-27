// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

interface PokemonData {
	id: number;
	name: string;
	types: string[];
	height: number;
	weight: number;
	spriteUrl?: string;
}

const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon';

function createPokemonWebviewHtml(pokemon: PokemonData): string {
	const imageUrl = pokemon.spriteUrl ?? '';
	const types = pokemon.types.map((type) => `<span class="type">${type}</span>`).join('');

	return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title>${pokemon.name}</title>
	<style>
		body { margin: 0; font-family: Arial, sans-serif; background: #071820; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
		.card { background: linear-gradient(180deg, #1b74c7 0%, #0e2442 100%); border-radius: 24px; padding: 24px; max-width: 450px; width: 100%; text-align: center; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25); }
		img { max-width: 100%; border-radius: 20px; border: 2px solid rgba(255, 255, 255, 0.14); background: rgba(255, 255, 255, 0.06); }
		h1 { margin: 20px 0 10px; font-size: 2.3rem; letter-spacing: 0.15em; }
		p { margin: 8px 0; font-size: 0.95rem; }
		.types { margin-top: 14px; }
		.type { display: inline-block; margin: 4px 6px; padding: 6px 12px; border-radius: 999px; background: rgba(255, 255, 255, 0.15); font-size: 0.85rem; }
	</style>
</head>
<body>
	<div class="card">
		${imageUrl ? `<img src="${imageUrl}" alt="${pokemon.name}" />` : '<div style="padding: 48px 0; color: #ccc;">Imagem não disponível</div>'}
		<h1>${pokemon.name.toUpperCase()}</h1>
		<div class="types">${types}</div>
		<p>Altura: ${(pokemon.height / 10).toFixed(1)} m</p>
		<p>Peso: ${(pokemon.weight / 10).toFixed(1)} kg</p>
	</div>
</body>
</html>`;
}

function createBigText(text: string): string {
	const font: Record<string, string[]> = {
		A: ['  AAAAA  ', ' A     A ', ' AAAAAAA ', ' A     A ', ' A     A '],
		B: [' BBBBBB  ', ' B     B ', ' BBBBBB  ', ' B     B ', ' BBBBBB  '],
		C: [' CCCCCCC ', ' C       ', ' C       ', ' C       ', ' CCCCCCC '],
		D: [' DDDDD   ', ' D     D ', ' D     D ', ' D     D ', ' DDDDD   '],
		E: [' EEEEEEE ', ' E       ', ' EEEEE   ', ' E       ', ' EEEEEEE '],
		F: [' FFFFFF  ', ' F       ', ' FFFFF   ', ' F       ', ' F       '],
		G: [' GGGGGGG ', ' G       ', ' G  GGGG ', ' G     G ', ' GGGGGG  '],
		H: [' H     H ', ' H     H ', ' HHHHHHH ', ' H     H ', ' H     H '],
		I: [' IIIIIII ', '   III   ', '   III   ', '   III   ', ' IIIIIII '],
		J: ['      J  ', '      J  ', ' J    J  ', ' J    J  ', '  JJJJ   '],
		K: [' K    K  ', ' K   K   ', ' KKKK    ', ' K   K   ', ' K    K  '],
		L: [' L       ', ' L       ', ' L       ', ' L       ', ' LLLLLLL '],
		M: [' M     M ', ' MM   MM ', ' M M M M ', ' M  M  M ', ' M     M '],
		N: [' N     N ', ' NN    N ', ' N N   N ', ' N  N  N ', ' N   N N '],
		O: ['  OOOOO  ', ' O     O ', ' O     O ', ' O     O ', '  OOOOO  '],
		P: [' PPPPPP  ', ' P     P ', ' PPPPPP  ', ' P       ', ' P       '],
		Q: ['  QQQQQ  ', ' Q     Q ', ' Q     Q ', ' Q  Q  Q ', '  QQQ Q  '],
		R: [' RRRRRR  ', ' R     R ', ' RRRRRR  ', ' R   R   ', ' R    R  '],
		S: [' SSSSSSS ', ' S       ', ' SSSSSSS ', '       S ', ' SSSSSSS '],
		T: [' TTTTTTT ', '   T     ', '   T     ', '   T     ', '   T     '],
		U: [' U     U ', ' U     U ', ' U     U ', ' U     U ', '  UUUUU  '],
		V: [' V     V ', ' V     V ', ' V     V ', '  V   V  ', '   V V   '],
		W: [' W     W ', ' W     W ', ' W  W  W ', ' W  W  W ', '  W W W  '],
		X: [' X     X ', '  X   X  ', '   X X   ', '  X   X  ', ' X     X '],
		Y: [' Y     Y ', '  Y   Y  ', '   Y Y   ', '    Y    ', '    Y    '],
		Z: [' ZZZZZZZ ', '      Z  ', '    Z    ', '  Z      ', ' ZZZZZZZ '],
		'0': [' 00000 ', '0     0', '0     0', '0     0', ' 00000 '],
		'1': ['   1  ', '  11  ', '   1  ', '   1  ', ' 1111 '],
		'2': [' 22222 ', '2    22', '    22 ', '  22   ', ' 222222'],
		'3': [' 33333 ', '3    3 ', ' 33333 ', '     3 ', ' 33333 '],
		'4': ['4   4 ', '4   4 ', '444444', '    4 ', '    4 '],
		'5': ['555555', '5     ', '555555', '     5', '555555'],
		'6': [' 66666 ', '6      ', '666666 ', '6    6 ', ' 66666 '],
		'7': ['7777777', '    7  ', '   7   ', '  7    ', ' 7     '],
		'8': [' 88888 ', '8     8', ' 88888 ', '8     8', ' 88888 '],
		'9': [' 99999 ', '9    9 ', ' 99999 ', '     9 ', ' 99999 '],
		' ': ['       ', '       ', '       ', '       ', '       '],
		'-': ['       ', '       ', '-------', '       ', '       ']
	};

	const normalized = text.toUpperCase().replace(/[^A-Z0-9 -]/g, ' ').replace(/ +/g, ' ').trim();
	const lines = Array.from({ length: 5 }, () => '');

	for (const character of normalized) {
		const pattern = font[character] ?? font[' '];
		for (let index = 0; index < 5; index += 1) {
			lines[index] += pattern[index] + ' ';
		}
	}

	return lines.join('\n');
}

async function getRandomPokemon(): Promise<PokemonData | undefined> {
	const id = Math.floor(Math.random() * 1025) + 1;
	const response = await fetch(`${POKEAPI_URL}/${id}`);

	if (!response.ok) {
		throw new Error(`Falha ao buscar Pokémon ${id}`);
	}

	const payload = await response.json() as {
		id: number;
		name: string;
		types: Array<{ type: { name: string } }>;
		height: number;
		weight: number;
		sprites: {
			front_default?: string;
			other?: {
				'official-artwork'?: {
					front_default?: string;
				};
			};
		};
	};

	return {
		id: payload.id,
		name: payload.name,
		types: payload.types.map((entry) => entry.type.name),
		height: payload.height,
		weight: payload.weight,
		spriteUrl: payload.sprites.other?.['official-artwork']?.front_default ?? payload.sprites.front_default
	};
}

async function showPokemonInWebview(pokemon: PokemonData) {
	const panel = vscode.window.createWebviewPanel(
		'pokemonImage',
		`Pokémon: ${pokemon.name}`,
		vscode.ViewColumn.One,
		{
			enableScripts: false,
			retainContextWhenHidden: true
		}
	);

	panel.webview.html = createPokemonWebviewHtml(pokemon);
}

async function showPokemonInTerminal(terminal: vscode.Terminal) {
	try {
		const pokemon = await getRandomPokemon();
		if (!pokemon) {
			return;
		}

		terminal.show(true);
		terminal.sendText(`Pokémon: ${pokemon.name} | Tipos: ${pokemon.types.join(' / ')}`);
		void showPokemonInWebview(pokemon);
	} catch (error) {
		console.error('Erro ao carregar Pokémon:', error);
		terminal.show(true);
		terminal.sendText('Não foi possível carregar o Pokémon agora.');
	}
}

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "pokemon-terminal" is now active!');

	const showPokemonCommand = vscode.commands.registerCommand('pokemon-terminal.showRandomPokemon', async () => {
		vscode.window.createTerminal('Pokémon Terminal');
	});

	const terminalListener = vscode.window.onDidOpenTerminal((terminal) => {
		void showPokemonInTerminal(terminal);
	});

	context.subscriptions.push(showPokemonCommand, terminalListener);
}

export function deactivate() {}
