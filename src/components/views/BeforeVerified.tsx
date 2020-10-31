import React from 'react'
import { useFirebase } from '@/scripts/hooks'
import { LoadingSpinner, PageContainer } from '@/components'
import { useSelector } from 'react-redux'
import { Button, makeStyles, Typography } from '@material-ui/core'
import { theme } from '@/styles'

export const BeforeVerified: React.FC = () => {
  const { isLoggingIn } = useSelector(state => state.currentUser)
  const { isResendEmailDisabled, resendEmailVerification } = useFirebase()
  const styles = useStyles()

  return (
    <div className={`AppBeforeVerified-root ${styles.root}`}>
      <PageContainer>
        {isLoggingIn ? (
          <LoadingSpinner />
        ) : (
          <>
            <Typography>
              メールアドレスの確認が終わっていません。受信メールを確認し、アカウントを有効化してから画面を更新してください。
            </Typography>
            <Button
              color="primary"
              onClick={resendEmailVerification}
              variant="contained"
              disabled={isResendEmailDisabled}
            >
              確認用メールを再送信する
            </Button>
          </>
        )}
      </PageContainer>
    </div>
  )
}

const useStyles = makeStyles({
  root: {
    paddingTop: theme.spacing(10),
    '& .MuiTypography-root': {
      marginBottom: theme.spacing(3)
    }
  }
})
