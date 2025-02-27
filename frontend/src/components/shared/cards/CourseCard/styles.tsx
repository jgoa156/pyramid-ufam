import styled from "styled-components";
import { Dropdown } from "react-bootstrap";

export const Wrapper = styled.div<{ marked: boolean, blurred: boolean }>`
  height: 100%;
  width: 100%;

	position: relative;
	padding: 15px;
	border-radius: 5px;
    box-shadow: 0 0 3px 2px var(--box-shadow);

	border: 1px solid transparent;
  word-break: break-word;

  & > div {
    display: flex;
    justify-content: space-between;

		& > i {
			font-size: 1.25rem;
			color: var(--muted);
		}
  }
	
  span {
    height: fit-content;
    padding: 2px 5px;
    margin-left: 5px;
    word-break: keep-all;

    font-size: 0.75rem;
    color: var(--muted);
    border: 1px solid var(--muted);
    border-radius: 5px;
  }
	h4 {
		font-size: 1.125rem;
		margin-bottom: 0;
	}
	p {
		color: var(--muted);
		font-size: 0.875rem;
    margin: 10px 0 0 !important;
	}

	transition: 0.3s;

	&:hover {
		color: var(--primary-color-2);
    	border-color: var(--muted);
	}

	${({ marked }) => marked && `
		border-color: var(--primary-color);
		&:hover {
			border-color: var(--primary-color-2);
		}`
  }
	${({ blurred }) => blurred && "filter: opacity(50%);"}
`;

export const Marker = styled.div`
	position: absolute;
	right: 10px;
	bottom: 10px;

	width: 25px;
	height: 25px;
	border-radius: 5px;
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);

	display: flex;
	justify-content: center !important;
	align-items: center !important;

	background-color: var(--primary-color);

	& > i {
		color: var(--white-1) !important;
	}
`;

export const UnstyledButton = styled.button`
  padding: 0;
  text-align: left;
  outline: none;
  border: none;
  background: transparent;
`;

export const UnstyledLink = styled.a`
  
`;

export const DropdownWrapper = styled(Dropdown)`
  position: absolute;
  top: 15px;
  right: 15px;
`;
export const DropdownMenu = styled(Dropdown.Menu)`
	z-index: 10;

	padding: 10px 0;

	background-color: var(--white-1);
	box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;
export const DropdownItem = styled(Dropdown.Item) <{ accent?: string }>`
	padding: 7.5px 15px;

	font-size: 0.875rem;
	color: var(--text-default) !important;
	border-left: 3px solid transparent;

	transition: 0.3s;

	i {
		vertical-align: top;
		margin-right: 5px;
	}

	&:hover {
		background-color: var(--white-2);
		border-color: ${({ accent }) => accent ? accent : "var(--primary-color)"};

    i {
      color: ${({ accent }) => accent ? accent : "var(--primary-color)"};
    }
	}
`;

export const Options = styled(Dropdown.Toggle)`
	display: flex;
	justify-content: center;
	align-items: center;

	margin-top: -5px;
	margin-right: -10px;
	padding: 0;

  font-size: 1.5rem;
	background-color: transparent !important;
	color: var(--muted);
	border: none !important;
	outline: none !important;

	transition: 0.3s;

	&:hover, &:focus {
    color: var(--primary-color);
    box-shadow: none !important;
	}
	&:after {
		display: none;
	}
`;