// https://on.cypress.io/api

describe('Main functionality', () => {
  it('check if complementary elements are on the screen', () => {
    cy.visit('/')

    // Not really important, but yest testing out
    cy.get('.intro').contains('This is a simple TicTacToe game that plays against a computer.')
  })
  it('check if the board has 9 tiles and they respond correctly', () => {
    cy.visit('/')

    // Make sure there are 9 tiles
    cy.get('[data-cy="grid"]').find('[data-cy="grid-tile-button"]').should('have.length', 9)

    // Click on the first tile
    cy.get('[data-cy="grid"]').find('.grid-tile:nth-child(1)').click()
  })
})
