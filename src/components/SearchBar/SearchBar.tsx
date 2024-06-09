import { useEffect, useRef, useState } from 'react';
import { SearchDropdown } from './Subcomponents';
import './SearchBar.css';

const SearchBar = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const searchBarRef = useRef<HTMLDivElement>(null);

	const onOutsideClick = (e: MouseEvent) => {
		if (
			searchBarRef.current &&
			!searchBarRef.current.contains(e.target as Node)
		) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		if (isOpen) document.addEventListener('mousedown', onOutsideClick);

		return () => {
			document.removeEventListener('mousedown', onOutsideClick);
		};
	}, [isOpen]);

	return (
		<div className="search-wrapper">
			<button
				onMouseDown={(e) => e.stopPropagation()}
				onClick={() => setIsOpen(!isOpen)}
				className={`search-button ${isOpen ? 'active' : ''}`}
			>
				<i className="codicon codicon-search" />
				SEARCH
			</button>
			{isOpen && (
				<div ref={searchBarRef}>
					<SearchDropdown />
				</div>
			)}
		</div>
	);
};

export default SearchBar;
