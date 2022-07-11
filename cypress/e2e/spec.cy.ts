describe('Whole flow test', () => {
  it('Whole flow test', () => {
    cy.visit(`${Cypress.env('base_url')}`);

    cy.get('#btnRegister').click();

    cy.get('#registerInputEmail').type('test@example.com').should('have.value', 'test@example.com');
    cy.get('#registerInputPassword').type('asdfasdf').should('have.value', 'asdfasdf');
    cy.get('#registerInputConfirmPassword').type('asdfasdf').should('have.value', 'asdfasdf');
    cy.get('button[type="submit"]').click();

    cy.get('#btnLogin').click();

    cy.get('#loginInputEmail').type('test@example.com').should('have.value', 'test@example.com');
    cy.get('#loginInputPassword').type('asdfasdf').should('have.value', 'asdfasdf');
    cy.get('button[type="submit"]').click();

    cy.get('input[name="address"]').type(Cypress.env('dest_public_address')).should('have.value', Cypress.env('dest_public_address'));
    cy.get('input[name="amount"]').type('0.001').should('have.value', '0.001');
    cy.get('button[type="submit"]').click();
  });
})