import React, { FormEvent, useState } from 'react';

import { css } from '@emotion/react';
import styled from '@emotion/styled';

import ConfigLayout from 'layouts/ConfigLayout';

import {
  DefaultButton,
  DefaultButtonPropsInterface,
  DefaultHStack,
  FormInput,
  FullWidthButton,
  IconHeaderText,
  Logo,
} from 'ui';

import { ConfigForm } from '@templates/index';

import { useForm } from '@common-hooks/useForm';

const StyledConfigPage = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - ${(props) => props.theme.layout.header.height});
  background-color: ${(props) => props.theme.color.layout.page};
`;

const numberInputCSS = css`
  width: 100%;
`;

const RequestPhoneAuthButton = styled((props: DefaultButtonPropsInterface) => (
  <DefaultButton {...props}></DefaultButton>
))`
  flex-shrink: 0;
`;

const marginBottomCSS = css`
  margin-bottom: 24px;
`;

const initialState = {
  phoneNumber: '',
  auth: '',
};

export default function ConfigPhoneNumberPage() {
  const [isRequested, setIsRequeseted] = useState(false);

  const { formState, updateFormState } = useForm<typeof initialState>({ initialState });

  const onRequestPhoneAuthButtonClick = () => {
    setIsRequeseted(() => true);
  };

  const onInput = (type: keyof typeof initialState) => (e: FormEvent) => {
    updateFormState(type, (e.target as HTMLInputElement).value);
  };

  return (
    <StyledConfigPage>
      <IconHeaderText
        level="h5"
        Icon={<Logo size={'32px'} />}
        alignItems="center"
        spacing={2}
        marginBottom={6}
        textPaddingTop="4px"
      >
        λ°κ°μμ! ππ»
      </IconHeaderText>
      <ConfigForm>
        <h6>μμ ν κ³μ κ΄λ¦¬λ₯Ό μν΄</h6>
        <h6 css={marginBottomCSS}>ν΄λμ ν λ²νΈλ₯Ό μ€μ ν΄μ£ΌμΈμ ππ»ββοΈ</h6>
        <DefaultHStack spacing={2}>
          <FormInput
            css={numberInputCSS}
            size="md"
            placeholder="-λ₯Ό μ μΈν λ²νΈλ§ μλ ₯"
            onInput={onInput('phoneNumber')}
            isInvalid={!formState.phoneNumber.length}
            flexShrink
          />
          <RequestPhoneAuthButton onClick={onRequestPhoneAuthButtonClick}>
            μΈμ¦ μμ²­νκΈ°
          </RequestPhoneAuthButton>
        </DefaultHStack>

        {isRequested && (
          <FormInput
            css={numberInputCSS}
            size="md"
            placeholder="λ¬Έμλ‘ μ μ‘λ μΈμ¦λ²νΈ μλ ₯"
            onInput={onInput('auth')}
            isInvalid={!formState.auth.length}
            flexShrink
            errorMessage="μΈμ¦λ²νΈκ° μΌμΉνμ§ μμμ."
          />
        )}

        <FullWidthButton disabled={!isRequested || !formState.auth.length}>
          μΈμ¦ μλ£νκΈ°
        </FullWidthButton>
      </ConfigForm>
    </StyledConfigPage>
  );
}

ConfigPhoneNumberPage.getLayout = function (page: React.ReactElement) {
  return <ConfigLayout>{page}</ConfigLayout>;
};
