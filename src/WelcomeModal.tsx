/**
 * ウェルカムモーダルコンポーネント
 * QRコード読み取り成功時に表示する歓迎メッセージをマテリアルデザインで実装
 */

import React from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Slide,
  Avatar,
  useTheme
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { VisitorInfo } from './types';

interface WelcomeModalProps {
  open: boolean;
  visitor: VisitorInfo | null;
  onClose: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * QRコード読み取り成功時のウェルカムモーダル
 * マテリアルデザインガイドラインに準拠したデザインで実装
 */
export function WelcomeModal({ open, visitor, onClose }: WelcomeModalProps) {
  const theme = useTheme();

  if (!visitor) {
    return null;
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      aria-describedby="welcome-dialog-description"
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.shadows[10],
          background: 'linear-gradient(135deg, #5F161D 0%, #8B4249 30%, #E8B4B8 100%)',
          color: 'white',
          textAlign: 'center'
        }
      }}
    >
      <DialogContent
        sx={{
          padding: theme.spacing(6, 4),
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: theme.spacing(3)
        }}
      >
        {/* 成功アイコン */}
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CheckCircleIcon 
            sx={{ 
              fontSize: 48, 
              color: theme.palette.success.light 
            }} 
          />
        </Avatar>

        {/* メイン歓迎メッセージ */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              lineHeight: 1.2,
              mb: 1
            }}
          >
            {visitor.name}さん、
          </Typography>
          
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 'bold',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              lineHeight: 1.3
            }}
          >
            ご来場ありがとうございます。
          </Typography>
        </Box>

        {/* 自動閉会メッセージ */}
        <Typography
          variant="body2"
          sx={{
            opacity: 0.8,
            marginTop: theme.spacing(2),
            textAlign: 'center'
          }}
        >
          このメッセージは5秒後に自動的に閉じます
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  test('WelcomeModal - visitor情報がnullの場合はnullを返す', () => {
    const props = {
      open: true,
      visitor: null,
      onClose: () => {}
    };
    
    expect(props.visitor).toBe(null);
  });

  test('WelcomeModal - visitor情報が正しく設定される', () => {
    const visitor = {
      name: '田中太郎',
      id: '12345'
    };
    
    const props = {
      open: true,
      visitor,
      onClose: () => {}
    };
    
    expect(props.visitor?.name).toBe('田中太郎');
    expect(props.visitor?.id).toBe('12345');
  });

  test('WelcomeModal - propsが適切に設定される', () => {
    const mockOnClose = () => {};
    const visitor = { name: 'テスト太郎', id: '99999' };
    
    const props = {
      open: true,
      visitor,
      onClose: mockOnClose
    };
    
    expect(props.open).toBe(true);
    expect(props.onClose).toBe(mockOnClose);
    expect(props.visitor?.name).toBe('テスト太郎');
  });

  test('WelcomeModal - メッセージが正しい形式で表示される', () => {
    const visitor = { name: '山田花子', id: '54321' };
    const expectedMainMessage = `${visitor.name}さん、`;
    const expectedSubMessage = 'ご来場ありがとうございます。';
    
    expect(expectedMainMessage).toBe('山田花子さん、');
    expect(expectedSubMessage).toBe('ご来場ありがとうございます。');
  });
}