import { Coin } from '../../../../types/Coin';
import './ListItem.css';

interface ListItemProps {
	coin: Coin;
	onAddToFavoritesClick: (name: string) => () => void;
	onCoinClick: (name: string) => () => void;
}

const ListItem = ({
	coin: { name, inFavorites },
	onAddToFavoritesClick,
	onCoinClick,
}: ListItemProps) => {
	return (
		<li>
			<button
				onClick={onAddToFavoritesClick(name)}
				className="add-to-favorites-button"
				aria-label="add to favorites"
			>
				{inFavorites ? (
					<i className="codicon codicon-star-full" />
				) : (
					<i className="codicon codicon-star-empty" />
				)}
			</button>
			<button onClick={onCoinClick(name)} className="coin-button">
				{name}
			</button>
		</li>
	);
};

export default ListItem;
