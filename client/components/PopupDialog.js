import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';
import Colors from '../utils/Colors';

const PopupDialog = (props) => {
    const { children, title, visible, cancel, confirm, resend, buttonConfirmTitle, buttonCancelTitle } = props;

    return (
        <Portal>
            <Dialog visible={visible} dismissable={false}>
                <Dialog.Title>{title}</Dialog.Title>
                {
                    children &&
                    <Dialog.Content>
                        {children}
                    </Dialog.Content>
                }
                <Dialog.Actions>
                    {cancel &&
                        <Button color={Colors.our_dark_blue} onPress={cancel}>{buttonCancelTitle ? buttonCancelTitle : "ביטול"}</Button>
                    }
                    {
                        resend &&
                        <Button color={Colors.our_dark_blue} onPress={() => resend(true)}>שלח קוד חדש</Button>
                    }
                    {
                        confirm &&
                        <Button color={Colors.our_dark_blue} onPress={() => confirm(true)}>{buttonConfirmTitle ? buttonConfirmTitle : "אישור"}</Button>
                    }
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );

};

const styles = StyleSheet.create({

});

export default PopupDialog;
