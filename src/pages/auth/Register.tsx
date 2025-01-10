import { RegisterForm } from '@/components/features/auth/RegisterForm'
import { useAppTranslation } from '@/hooks/useAppTranslation'
import { useAuth } from '@/hooks/useAuth'
import { RegisterRequest } from '@/services/auth.service'
import { Typography, message } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const { Title } = Typography

const RegisterPage = () => {
  const { t } = useAppTranslation('auth')
  const navigate = useNavigate()
  const { register } = useAuth()
  const [termsAccepted, setTermsAccepted] = useState(false)

  const handleRegister = async (values: any) => {
    if (!termsAccepted) {
      message.error(t('validation.acceptTerms'))
      return
    }

    const payload: RegisterRequest = {
      id: 0,
      clinicId: 1,
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      phone: values.phone,
      role: 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      password: values.password,
    }

    await register.mutateAsync(payload, {
      onSuccess: () => {
        navigate('/login')
      },
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <Title level={3}>{t('register.title')}</Title>
      </div>
      <RegisterForm
        onFinish={handleRegister}
        isLoading={register.isPending}
        termsAccepted={termsAccepted}
        onTermsChange={setTermsAccepted}
      />
    </div>
  )
}

export default RegisterPage
