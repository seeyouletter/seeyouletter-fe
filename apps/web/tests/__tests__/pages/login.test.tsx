// __tests__/index.test.jsx
import '@testing-library/jest-dom';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockRouter } from 'tests/__mocks__/router';
import { UserEventType } from 'tests/types';

import { useRouter } from 'next/router';

import LoginPage from '@pages/login';

import { CustomThemeProvider } from 'ui';

import { LoginFormButton } from '@templates/form/LoginForm';

afterEach(cleanup);

export const Login = () => {
  return (
    <CustomThemeProvider>
      <LoginPage />
    </CustomThemeProvider>
  );
};

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: createMockRouter,
}));

describe('LoginPage', () => {
  let idInput: null | HTMLElement;
  let pwInput: null | HTMLElement;

  let result: ReturnType<typeof render>;

  let loginFormButton: null | HTMLElement;

  let user: UserEventType;

  const throwUserCheckMessage = (user: UserEventType) => {
    if (!user) {
      throw new Error('π¨ CHECK USEREVENT.');
    }
  };

  beforeEach(() => {
    user = userEvent.setup();
    result = render(<Login />);

    idInput = screen.getByTestId('id-input');
    pwInput = screen.getByTestId('password-input');
    loginFormButton = screen.getByTestId('login-button');

    if (!user) throwUserCheckMessage(user);
  });

  afterEach(() => {
    cleanup();
    result.unmount();
  });

  it('λ λλ§μ΄ μλ£λλ©΄ νμ΄μ§ μΉμμ΄ λμμΌ νλ€.', () => {
    const page = screen.getByTestId('page');
    expect(page).toBeInTheDocument();
  });

  // NOTE: νμ€νΈ μ½λ μ€μ  μλ£ ν μ§μΈ κ².
  /* eslint-disable @typescript-eslint/no-empty-function */
  describe('LoginForm', () => {
    it('Inputs: μμ΄λ, ν¨μ€μλ μΈνμ΄ μ‘΄μ¬ν΄μΌ νλ€.', () => {
      expect(idInput).toBeInTheDocument();
      expect(pwInput).toBeInTheDocument();
    });

    it('Inputs: μμ΄λ μΈνμλ "μ΄λ©μΌ ID"λΌλ λ¬Έκ΅¬κ° λμμΌ νλ€.', () => {
      const idInput = screen.getByTestId('id-input');

      expect(idInput).toHaveAttribute('placeholder', 'μ΄λ©μΌ ID');
    });

    it('Inputs: λΉλ°λ²νΈ μΈνμλ "ν¨μ€μλ ID"λΌλ λ¬Έκ΅¬κ° λμμΌ νλ€.', () => {
      const pwInput = screen.getByTestId('password-input');

      expect(pwInput).toHaveAttribute('placeholder', 'λΉλ°λ²νΈ');
    });

    it('Inputs: μμ΄λ μΈνμ μ¬μ©μ μλ ₯ μ ν¨μκ° νΈμΆλμ΄μΌ νλ€.', async () => {
      try {
        if (!user) {
          throwUserCheckMessage(user);
          return;
        }

        if (!idInput) {
          expect(idInput).toThrow('ID Inputμ΄ μμ΅λλ€');
          return;
        }

        await user.type(idInput as HTMLInputElement, 'test@test.test');
      } catch (e) {
        /* eslint-disable-next-line no-console */
        console.error(e);
      }
    });

    it('Link: νμκ°μ λ§ν¬κ° μ‘΄μ¬ν΄μΌ νλ€.', () => {
      const link = screen.getByLabelText('νμκ°μ λ§ν¬');
      expect(link).toBeInTheDocument();
    });

    it('Link: νμκ°μ λ§ν¬λ νμκ°μ νμ΄μ§μ hrefκ° μ£Όμ΄μ ΈμΌ νλ€.', () => {});

    it('Button: λ‘κ·ΈμΈ λ²νΌμ΄ μ‘΄μ¬ν΄μΌ νλ€.', () => {
      expect(loginFormButton).toBeInTheDocument();
    });

    it('μ€ν¬λ¦° λ¦¬λμμλ μμ΄λμ νμ€νΈλ₯Ό μλ ₯νλΌλ λ¬Έκ΅¬κ° λμ€λλ‘ νλ€.', () => {
      const screenReaderHiddenText = screen.getByText(
        'λ‘κ·ΈμΈ νμ΄μ§μλλ€. μμ΄λμ λΉλ°λ²νΈλ₯Ό μλ ₯ν΄μ£ΌμΈμ!'
      );
      expect(screenReaderHiddenText).toBeInTheDocument();
    });

    // fit('Link: νμκ°μ λ§ν¬λ₯Ό λλ₯΄λ©΄ νμκ°μ νμ΄μ§λ‘ μ΄λλμ΄μΌ νλ€.', () => {});

    it('Link: μμ΄μ½ λ²νΌ ννμ λ€μ΄λ², μΉ΄μΉ΄μ€, λ‘κ·ΈμΈ λ§ν¬κ° μ‘΄μ¬ν΄μΌ νλ€.', () => {
      const naverButton = screen.getByRole('link', { name: 'λ€μ΄λ² λ‘κ·ΈμΈ λ§ν¬' });
      const kakaoButton = screen.getByRole('link', { name: 'μΉ΄μΉ΄μ€ λ‘κ·ΈμΈ λ§ν¬' });

      expect(naverButton).toBeInTheDocument();
      expect(kakaoButton).toBeInTheDocument();
    });

    // NOTE: μμ§ μ ν΄μ§ λͺμΈκ° μμΌλ―λ‘ μμμ κΈΈμ΄ λ° μ΄λ©μΌ νμ μ ν¨μ± κ²μ¬λ§ μ€μνλ€.
    it('LoginFormButton: μμ΄λμ ν¨μ€μλ λ λ€ μ λλ‘ μλ ₯μ΄ λμ§ μμλ€λ©΄ λ‘κ·ΈμΈ λ²νΌμ΄ λΉνμ±νλμ΄μΌ νλ€.', async () => {
      if (!idInput || !pwInput) {
        expect(idInput).toThrow('ID Inputμ΄ μμ΅λλ€');
        expect(pwInput).toThrow('λΉλ°λ²νΈ Inputμ΄ μμ΅λλ€.');
        return;
      }

      expect(loginFormButton).toBeDisabled();
    });

    it('LoginFormButton: λͺ¨λ μλ ₯μ΄ λμλ€λ©΄ λ²νΌμ΄ νμ±νλμ΄μΌ νλ€.', async () => {
      if (!user) {
        throwUserCheckMessage(user);
        return;
      }

      if (!idInput || !pwInput) {
        expect(idInput).toThrow('ID Inputμ΄ μμ΅λλ€');
        expect(pwInput).toThrow('λΉλ°λ²νΈ Inputμ΄ μμ΅λλ€.');
        return;
      }

      await user.type(idInput, 'test@test.test');
      await user.type(pwInput, 'seeyouletter');

      expect(loginFormButton).not.toBeDisabled();
    });

    it('λ‘κ·ΈμΈ μμ²­μ΄ μ€ννλ©΄ μλ¬ λ©μμ§κ° νλ©΄ μμ λμμΌ νλ€.', () => {});
  });
});

describe('LoginFormButton: ', () => {
  const mockRouter = useRouter();

  const login = jest.fn();

  const onSubmit = jest.fn(async () => {
    try {
      await login();
      mockRouter.push('/');
    } catch (e) {
      /* eslint-disable */
      return { isError: true, message: e };
    }
  });

  beforeEach(() => {
    render(
      <>
        <LoginFormButton data-testid="login-button" disabled={false} onSubmit={onSubmit}>
          μ΄λ©μΌλ‘ λ‘κ·ΈμΈνκΈ°
        </LoginFormButton>
      </>
    );
  });

  it('λ‘κ·ΈμΈ νΌ λ²νΌμ΄ νμ±ν λκ³  ν΄λ¦­μ νλ©΄ onSubmit ν¨μκ° νΈμΆλμ΄μΌ νλ€.', () => {
    const loginFormButton = screen.getByTestId('login-button');

    fireEvent.click(loginFormButton);

    expect(onSubmit).toHaveBeenCalled();
  });

  it('λ‘κ·ΈμΈ μμ²­μ΄ μ±κ³΅νλ©΄ νμ΄μ§κ° κΈ°λ³Έ νμ΄μ§λ‘ μ΄λλμ΄μΌ νλ€.', () => {
    const loginFormButton = screen.getByTestId('login-button');

    fireEvent.click(loginFormButton);

    // ...
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});
