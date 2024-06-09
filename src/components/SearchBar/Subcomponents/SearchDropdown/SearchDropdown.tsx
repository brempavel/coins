import { useState, ChangeEvent, FormEvent, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getCoins } from '../../../../services/coinsService';
import { Coin } from '../../../../types/Coin';
import { debounce } from '../../../../utils/common';
import { ListItem } from '..';
import Fuse from 'fuse.js';
import './SearchDropdown.css';

const SearchDropdown = () => {
	const [inputValue, setInputValue] = useState<string>('');
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [coins, setCoins] = useState<Coin[]>([]);
	const [isFiltered, setIsFiltered] = useState<boolean>(false);

	useEffect(() => {
		(async () => {
			const coins = (await getCoins()).map((coin: string) => ({
				id: uuidv4(),
				name: coin,
				inFavorites: false,
			}));
			setCoins(coins);
		})();
	}, []);

	const fuse = useMemo(() => new Fuse(coins, { keys: ['name'] }), [coins]);

	const foundCoins = useMemo(() => {
		if (searchTerm) {
			return fuse.search(searchTerm).map(({ item }) => item);
		}
		return coins;
	}, [searchTerm, fuse, coins]);

	const debouncedSetSearchTerm = useMemo(
		() => debounce((value: string) => setSearchTerm(value), 300),
		[]
	);

	const onChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setInputValue(value);
		debouncedSetSearchTerm(value);
	};

	const onClearInputClick = () => {
		setInputValue('');
		setSearchTerm('');
	};

	const onAllCoinsClick = () => {
		if (isFiltered) setIsFiltered(false);
	};

	const onFavoritesClick = () => {
		if (!isFiltered) setIsFiltered(true);
	};

	const onCoinClick = (name: string) => () => {
		setSearchTerm(name);
		setInputValue(name);
	};

	const onAddToFavoritesClick = (name: string) => () => {
		setCoins((coins) => {
			return coins.map((coin) => {
				if (coin.name === name) {
					return coin.inFavorites
						? { ...coin, inFavorites: false }
						: { ...coin, inFavorites: true };
				}
				return coin;
			});
		});
	};

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
	};

	return (
		<form className="search-form" onSubmit={onSubmit}>
			<div className="search-input-wrapper">
				<button type="submit" aria-label="search">
					<i className="codicon codicon-search" />
				</button>
				<input
					type="text"
					name="search-input"
					id="search-input"
					placeholder="Search..."
					value={inputValue}
					onChange={onChange}
				/>
				{searchTerm && (
					<button onClick={onClearInputClick}>
						<i className="codicon codicon-close" />
					</button>
				)}
			</div>
			<div className="coins-list-wrapper">
				<div className="filter-options">
					<button
						onClick={onFavoritesClick}
						className={`favorites-button ${isFiltered ? 'active' : ''}`}
					>
						<i className="codicon codicon-star-full" />
						FAVORITES
					</button>
					<button
						onClick={onAllCoinsClick}
						className={`all-coins-button ${!isFiltered ? 'active' : ''}`}
					>
						ALL COINS
					</button>
				</div>
				<ul>
					{isFiltered
						? foundCoins
								.filter((coin) => coin.inFavorites)
								.map((coin) => {
									return (
										<ListItem
											key={coin.id}
											coin={coin}
											onAddToFavoritesClick={onAddToFavoritesClick}
											onCoinClick={onCoinClick}
										/>
									);
								})
						: foundCoins.map((coin) => (
								<ListItem
									key={coin.id}
									coin={coin}
									onAddToFavoritesClick={onAddToFavoritesClick}
									onCoinClick={onCoinClick}
								/>
						  ))}
				</ul>
			</div>
		</form>
	);
};

export default SearchDropdown;
