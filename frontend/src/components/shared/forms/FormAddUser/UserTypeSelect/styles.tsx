import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  
	p {
		margin-bottom: 0;
    color: var(--muted);
	}

	& > div + p {
		margin-top: 35px;
	}
`;

export const CardGroup = styled.div`
	margin-top: 15px;
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 25px;
	justify-items: center;
	margin-bottom: 20px;

  @media (max-width: 1200px) {
		grid-gap: 15px;
	}
	@media (max-width: 768px) {
		display: flex;
		flex-wrap: wrap;	
	}
`;