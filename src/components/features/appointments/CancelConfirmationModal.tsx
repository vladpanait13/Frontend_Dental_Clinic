import { useAppointments } from '@/hooks/useAppointments'
import { useAppTranslation } from '@/hooks/useAppTranslation'
import { Button, Modal } from 'antd'
import { format, parseISO } from 'date-fns'
import { AlertCircle, Clock, CreditCard, MapPin, User } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface CancelConfirmationModalProps {
  isOpen: boolean
  appointmentId: number
  onClose: () => void
}

const CancelConfirmationModal = ({
  isOpen,
  appointmentId,
  onClose,
}: CancelConfirmationModalProps) => {
  const { t } = useAppTranslation('appointments')
  const { appointments, cancelAppointment } = useAppointments()
  const appointment = appointments?.find(a => a.id === appointmentId)

  if (!appointment) return null

  const handleCancel = async () => {
    try {
      await cancelAppointment.mutateAsync(appointmentId)
      toast.success(t('notifications.success.cancelled'))
      onClose()
    } catch (error) {
      toast.error(t('notifications.error.cancellation'))
      console.error('Failed to cancel appointment:', error)
    }
  }

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 px-2 pt-2">
          <AlertCircle className="text-red-500" size={24} />
          <h3 className="text-xl font-semibold text-gray-900">{t('cancelModal.title')}</h3>
        </div>
      }
      open={isOpen}
      footer={null}
      onCancel={onClose}
      width={500}
      className="rounded-xl overflow-hidden"
    >
      <div className="py-6 space-y-6">
        <div className="space-y-4">
          <p className="text-lg text-gray-600">{t('cancelModal.message')}</p>

          <div className="bg-gray-50 p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <User size={20} className="text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">{appointment.serviceName}</p>
                <p className="text-gray-600">
                  {t('appointmentList.doctorPrefix')} {appointment.dentistFirstName}{' '}
                  {appointment.dentistLastName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-gray-400" />
              <p className="text-gray-600">
                {appointment.clinicName}, {appointment.city}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={20} className="text-gray-400" />
              <p className="text-gray-600">
                {format(parseISO(appointment.startTime), 'EEE d MMM, yyyy')}{' '}
                {t('appointmentList.timeFormat')} {format(parseISO(appointment.startTime), 'HH:mm')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <CreditCard size={20} className="text-gray-400" />
              <p className="text-gray-600">
                {appointment.currency} {appointment.servicePrice}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            size="large"
            onClick={onClose}
            className="flex-1 h-11"
            disabled={cancelAppointment.isPending}
          >
            {t('cancelModal.keepButton')}
          </Button>
          <Button
            danger
            size="large"
            onClick={handleCancel}
            loading={cancelAppointment.isPending}
            className="flex-1 h-11"
          >
            {t('cancelModal.confirmButton')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CancelConfirmationModal
